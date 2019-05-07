console.log("background.js loaded");

// Ouverture de la page d'interface sur click de l'icone de l'extension
var extensionWindowId, originalTabUrl, originalTabId, originalWindowId;

chrome.browserAction.onClicked.addListener(function (tab) {
    var panelUrl = chrome.runtime.getURL("extension/views/main_panel.html");
    chrome.windows.create({
        url: panelUrl,
        type: 'panel',
        width: 700,
        height: 520
    }, function (window) {
        extensionWindowId = window.id;
        originalTabUrl = tab.url;
        originalTabId = tab.id;
        originalWindowId = tab.windowId;        
    });
});