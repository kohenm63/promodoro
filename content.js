// Content script

// Function to send a message to the background script
function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(message);
}

// Function to handle messages from the background script
function handleMessageFromBackgroundScript(message) {
    if (message.action === 'pauseVideo') {
        pauseVideoPlayer();
    }
}

// Pause and reset the video player
function pauseVideoPlayer() {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.removeAttribute('src');
    }
}

// Add a listener to receive messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessageFromBackgroundScript(message);
});

// Send a message to the background script when the content script is loaded
sendMessageToBackgroundScript({
    action: 'contentScriptLoaded'
});
