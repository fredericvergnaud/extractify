// new version

var extensionWindowId, browserTabUrl, browserTabId, browserWindowId;

chrome.action.onClicked.addListener(function (tab) {
    var panelUrl = chrome.runtime.getURL("extension/views/main_panel.html");
    chrome.windows.create({
        url: panelUrl,
        type: 'panel',
        width: 700,
        height: 520
    }, function (window) {
        let storage = chrome.storage.local;
        let extensionWindowId = window.id;
        let browserTabUrl = tab.url;
        let browserTabId = tab.id;
        let browserWindowId = tab.windowId;
        storage.set({
          "extensionWindowId": extensionWindowId,
          "browserTabUrl": browserTabUrl,
          "browserTabId": browserTabId,
          "browserWindowId": browserWindowId
        });

    });
});
