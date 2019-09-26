// Version 3

var extensionWindowId, browserTabUrl, browserTabId, browserWindowId;

chrome.browserAction.onClicked.addListener(function (tab) {
    var panelUrl = chrome.runtime.getURL("extension/views/main_panel.html");
    chrome.windows.create({
        url: panelUrl,
        type: 'panel',
        width: 700,
        height: 520
    }, function (window) {
        extensionWindowId = window.id;
        browserTabUrl = tab.url;
        browserTabId = tab.id;
        browserWindowId = tab.windowId;        
    });
});