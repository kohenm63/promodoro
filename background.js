let timerId = null;
let isBreak = false;
let musicUrl = '';
let remainingTime = 0;
let isPageActive = true;
let isPaused = false;

function startTimer(minutes) {
    let duration = remainingTime > 0 ? remainingTime : minutes * 60;
    remainingTime = 0;
    timerId = setInterval(() => {
        if (!isPageActive) return;
        if (!isPaused) {
            duration--;
            if (duration <= 0) {
                clearInterval(timerId);
                if (isBreak) {
                    isBreak = false;
                    playMusic();
                } else {
                    isBreak = true;
                }
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    isBreak = false;
    remainingTime = 0;
    stopMusic();
}

function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}

function playMusic() {
    if (musicUrl) {
        const audio = new Audio(musicUrl);
        audio.loop = true;
        audio.play();
    }
}

function stopMusic() {
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].pause();
        audioElements[i].currentTime = 0;
    }
}

function getRemainingTime() {
    if (timerId) {
        return remainingTime;
    }
    return 0;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startTimer") {
        musicUrl = request.url;
        startTimer(request.minutes);
    } else if (request.action === "stopTimer") {
        stopTimer();
    } else if (request.action === "pauseTimer") {
        pauseTimer();
    } else if (request.action === "resumeTimer") {
        resumeTimer();
    } else if (request.action === "getRemainingTime") {
        sendResponse(getRemainingTime());
    }
});

chrome.tabs.onActivated.addListener(() => {
    if (timerId && isBreak) {
        remainingTime = 0;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active) {
        isPageActive = true;
    }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        isPageActive = false;
    } else {
        chrome.runtime.sendMessage({
                action: "getRemainingTime",
            },
            (response) => {
                remainingTime = response;
            }
        );
        isPageActive = true;
    }
});
