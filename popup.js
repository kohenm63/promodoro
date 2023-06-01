document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const pauseButton = document.getElementById("pause-button");
    const resumeButton = document.getElementById("resume-button");
    const timerText = document.getElementById("timer-text");
    const urlInput = document.getElementById("url-input");

    let isRunning = false;
    let isPaused = false;
    let minutes = 25; // Default work duration in minutes
    let secondsRemaining = 0;
    let countdownIntervalId = null;
    let musicUrl = "";

    function updateTimerDisplay() {
        const displayMinutes = Math.floor(secondsRemaining / 60);
        const displaySeconds = secondsRemaining % 60;
        timerText.textContent = `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        let seconds = minutes * 60;
        secondsRemaining = seconds;

        updateTimerDisplay();

        countdownIntervalId = setInterval(() => {
            if (!isPaused) {
                secondsRemaining--;
                updateTimerDisplay();

                if (secondsRemaining <= 0) {
                    clearInterval(countdownIntervalId);
                    timerText.textContent = "Time's up!";
                    isRunning = false;
                    isPaused = false;
                    chrome.runtime.sendMessage({
                        action: "timerFinished"
                    });
                }
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(countdownIntervalId);
        timerText.textContent = "";
        isRunning = false;
        isPaused = false;
        secondsRemaining = 0;
        chrome.runtime.sendMessage({
            action: "timerStopped"
        });
    }

    function pauseResumeTimer() {
        if (isRunning) {
            isPaused = !isPaused;
            if (isPaused) {
                clearInterval(countdownIntervalId);
                chrome.runtime.sendMessage({
                    action: "timerPaused"
                });
            } else {
                startTimerFromRemainingTime();
                chrome.runtime.sendMessage({
                    action: "timerResumed"
                });
            }
        }
    }

    function startTimerFromRemainingTime() {
        countdownIntervalId = setInterval(() => {
            if (!isPaused) {
                secondsRemaining--;
                updateTimerDisplay();

                if (secondsRemaining <= 0) {
                    clearInterval(countdownIntervalId);
                    timerText.textContent = "Time's up!";
                    isRunning = false;
                    isPaused = false;
                    chrome.runtime.sendMessage({
                        action: "timerFinished"
                    });
                }
            }
        }, 1000);
    }

    function handleUrlInput() {
        musicUrl = urlInput.value;
    }

    startButton.addEventListener("click", () => {
        if (!isRunning) {
            minutes = parseInt(prompt("Enter work duration in minutes:", minutes));
            if (minutes && minutes > 0) {
                startTimer();
                isRunning = true;
                chrome.runtime.sendMessage({
                    action: "timerStarted",
                    minutes: minutes
                });
            }
        } else {
            pauseResumeTimer();
        }
    });

    stopButton.addEventListener("click", () => {
        if (isRunning) {
            stopTimer();
        }
    });

    pauseButton.addEventListener("click", () => {
        pauseResumeTimer();
    });

   resumeButton.addEventListener("click", () => {
       if (isRunning && isPaused) {
           pauseResumeTimer();
       }
   });


    urlInput.addEventListener("input", handleUrlInput);
});
