var levelTypes = {};
var colTitles = {};

document.addEventListener('DOMContentLoaded', function () {
    let background = chrome.extension.getBackgroundPage();
    extensionWindowId = background.extensionWindowId;
    browserTabUrl = background.browserTabUrl;
    browserTabId = background.browserTabId;
    browserWindowId = background.browserWindowId;
    start();
});