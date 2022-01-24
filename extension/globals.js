var levelTypes = {};
var colTitles = {};
var extensionWindowId, browserTabUrl, browserTabId, browserWindowId;

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(["extensionWindowId", "browserTabUrl", "browserTabId", "browserWindowId"], function(data){
      extensionWindowId = data.extensionWindowId;
      browserTabUrl = data.browserTabUrl;
      browserTabId = data.browserTabId;
      browserWindowId = data.browserWindowId;
    });
    start();
});
