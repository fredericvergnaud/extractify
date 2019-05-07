console.log("shared.js loaded");

var extensionWindowId = 0;
var originalTabUrl = "";
var originalTabId = 0;
var originalWindowId = 0;

var globalLevelId = 0;
var globalRowId = 0;
var globalColId = 0;

var levels = [];

// TABS //

$(function () {
    $("#tabs").tabs();
});

// event listener lorsqu'on active un tab
// => focus du tab de navigateur
$("#tabs").on("tabsactivate", function (event, ui) {
    let id = ui.newTab.attr('id');
    let levelId = id.substr(id.indexOf('level-') + 6, id.length);
    let level = getLevel(levelId);
//    console.log("tab id à focuser : " + level.tabId);
    chrome.tabs.update(level.tabId, {
        "active": true
    }, function (tab) {});
});

//// listener sur la page de départ pour détecter un reload
//chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//    if (levels.length > 0)
//        if (tab.id === originalTabId && tab.url === originalTabUrl && changeInfo.status === 'complete' && levels !== undefined && levels[0].rows !== undefined && levels[0].rows.length > 0) {
//            chrome.tabs.sendMessage(originalTabId, {
//                action: "highlightContent",
//                data: levels
//            });
//        }
//});

function removeHighlightedElement(tabId, element) {
    chrome.tabs.sendMessage(tabId, {
        action: "removeHighlightedElement",
        data: element
    });
}

function highlightContent(tabId, level) {
//    console.log("highlightContent va envoyer un message à tab " + tabId);
    chrome.tabs.sendMessage(tabId, {
        action: "highlightContent",
        data: level
    });
}

function removeBrowserTabs(levelsToRemove) {
//    console.log("removeTabs : levelsToRemove length = " + levelsToRemove.length);
    for (let i = 0; i < levelsToRemove.length; i++) {
        let level = levelsToRemove[i];
        let levelTabId = level.tabId;
//        console.log("removeTabs : levelTabId to remove = " + levelTabId);
        chrome.tabs.remove(levelTabId, function () {});
    }
}

function updateTab(tabId, url) {
    return new Promise(function (resolve, reject) {
        // on update le tab
        chrome.tabs.update(tabId, {
            "active": true,
            url: url
        }, function (tab) {
            chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
                if (changeInfo.status === 'complete') {
//                    console.log("updateTab : tab with id " + tab.id + " and url " + tab.url + " updated complete");
                    resolve('complete');
                    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                }
            });
        });
    });
}

function sendMessageToTab(tabId, action, data) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(originalWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: action,
            data: data
        }, function (response) {
            if (response !== undefined) {
                chrome.windows.update(extensionWindowId, {
                    focused: true
                });
                if (response.response === 'selectedRows' || response.response === 'selectedCols' || response.response === 'selectedDepth' || response.response === 'selectedPagination')
                    resolve(response.responseData);
                else
                    reject('failed');
            } else
                reject('failed');
        });
    });
}

// SCRAPING //

// createTab
// Le callback de la création du tab se produit à la création du tab, pas à son chargement complet
// -> Promise

function createNewTab(url) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.create({
            url: url
        }, function (tab) {
            console.log("createNewTab : tab " + tab.id + " created");
            resolve(tab.id);
        });
        //            resolve(tab.id);
        //            chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
        //                if (changeInfo.status === 'complete') {
        //                    console.log("tab with id " + tabId + " and url " + tab.url + " created complete");
        //                    resolve(tabId);
        //                    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
        //                }                
        //            });

    });
}

// updateScrapingTab
// Le callback de l'update de newTab se produit à l'update, mais pas au chargement complet de la page
// -> Promise + Nécessité de rajouter un listener (auquel on donne un nom pour pouvoir le supprimer lors du resolve) à onUpdated qui va renvoyer un status : on pourra alors faire un test sur ce statut ('complete')
// sendMessage est une fonction synchrone : pas de Promise
function updateLevelScraping(newTabId, url, levelStructureMap) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.update(newTabId, {
            url: url
        }, function (tab) {
            chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
                if (changeInfo.status === 'complete') {
//                    console.log("updateLevelScraping : tab with id " + newTabId + " and url " + url + " updated complete");
                    chrome.tabs.sendMessage(tab.id, {
                        action: "levelScrapping",
                        data: levelStructureMap,
                        rowNbr: rowNbr
                    }, function (response) {
                        if (response.data != "") {
                            rowNbr += response.responseData.length;
                            console.log("rowNbr passe à " + rowNbr);
                            resolve(response.responseData);
                        }
                        else
                            reject("failed");
                        chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                    });
                }
            });
        });
    });
}

function updatePaginationScraping(newTabId, url, paginationTagClass) {
    return new Promise(function (resolve, reject) {
        chrome.tabs.update(newTabId, {
            url: url
        }, function (tab) {
            chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
                if (changeInfo.status === 'complete') {
//                    console.log("updatePaginationScraping : tab with id " + newTabId + " and url " + url + " updated complete");
                    chrome.tabs.sendMessage(tab.id, {
                        action: "paginationScrapping",
                        data: paginationTagClass
                    }, function (response) {
                        if (response.data != "" )
                            resolve(response.responseData);
                        else
                            reject("failed");
                        chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                    });
                }
            });
        });
    });
}
