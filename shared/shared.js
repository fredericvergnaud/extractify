//console.log("shared.js loaded");

var globalLevelId = 0;
var globalRowId = 0;
var globalColId = 0;

var levels = [];
var options = [];

// JQUERY-UI //

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

function removeHighlightedElement(tabId, element) {
    chrome.tabs.sendMessage(tabId, {
        action: "removeHighlightedElement",
        data: element
    });
}

function highlightContent(tabId, level) {
    console.log("highlightContent reçu : tabId = " + tabId + " | level = ", level);
    chrome.tabs.sendMessage(tabId, {
        action: "highlightContent",
        data: level
    });
}

function highlightRows(tabId, level, rowSelector, rowId) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: "highlightRows",
            level: level,
            rowSelector: rowSelector,
            rowId: rowId
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            console.log("response = ", response);
            if (response !== undefined) {
                resolve(response.responseData);
            }
        });
    });
}

function highlightCols(tabId, row, colSelector, colId, level) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: "highlightCols",
            row: row,
            colSelector: colSelector,
            colId: colId,
            level: level
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            if (response !== undefined) {
                resolve(response.responseData);
            }
        });
    });
}

function highlightDepth(tabId, row, depthSelector) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: "highlightDepth",
            row: row,
            depthSelector: depthSelector
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            if (response !== undefined) {
                resolve(response.responseData);
            }
        });
    });
}

function highlightPagination(tabId, level, paginationSelector) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: "highlightPagination",
            level: level,
            paginationSelector: paginationSelector
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            if (response !== undefined) {
                resolve(response.responseData);
            }
        });
    });
}

function matchPaginationPrefixAndStep(tabId, prefix, step) {
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(tabId, {
            action: "matchPaginationPrefixAndStep",
            prefix: prefix,
            step: step
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            if (response !== undefined) {
                resolve(response.responseData);
            }
        });
    });
}

function removeBrowserTabs(levelsToRemove) {
    for (let i = 0; i < levelsToRemove.length; i++) {
        let level = levelsToRemove[i];
        let levelTabId = level.tabId;
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
                    resolve('complete');
                    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                }
            });
        });
    });
}

function sendMessageToTab(level, action, data) {
    // on ouvre le dialog de Cancel (freezing)
    $("#select_content_dialog_wrapper").css("display", "block");
    selectContentDialog(level);
    // on met le focus sur la fenêtre originale
    chrome.windows.update(browserWindowId, {
        focused: true
    });
    return new Promise(function (resolve, reject) {
        chrome.tabs.sendMessage(level.tabId, {
            action: action,
            data: data,
            level: level
        }, function (response) {
            var lastError = chrome.runtime.lastError;
            if (lastError) {
                console.log("lastError.message", lastError.message);
                // 'Could not establish connection. Receiving end does not exist.'
                return;
            }
            if (response !== undefined) {
                chrome.windows.update(extensionWindowId, {
                    focused: true
                });
                if (response.response === 'selectedRows' || response.response === 'selectedCols' || response.response === 'selectedDepth' || response.response === 'selectedPagination' || response.response === 'selectedCustomPagination')
                    resolve(response.responseData);
                else
                    reject('failed');
            } else
                reject('failed');
        });
    });
}

function stopContentSelect(level) {
    updateTab(level.tabId, level.url)
        .then(function (response) {
            if (response === "complete")
                highlightContent(level.tabId, level);
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
            chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
                if (changeInfo.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                    resolve(tab.id);
                }
            });
        });
    });
}

// updateScrapingTab
// Le callback de l'update de newTab se produit à l'update, mais pas au chargement complet de la page
// -> Promise + Nécessité de rajouter un listener (auquel on donne un nom pour pouvoir le supprimer lors du resolve) à onUpdated qui va renvoyer un status : on pourra alors faire un test sur ce statut ('complete')
// sendMessage est une fonction synchrone : pas de Promise
function updatePageScraping(newTabId, url, levelStructureMap, requestLatency, scrapingPageInOwnTab) {
    console.log("updatePageScraping : requestLatency = " + requestLatency);
    var lastError;
    return new Promise(function (resolve, reject) {
        chrome.tabs.update(newTabId, {
            url: url
        }, function (tab) {
            lastError = chrome.runtime.lastError;
            if (lastError) {
//                alert(extensionLang.ScrapingError + " (in tab)\n" + lastError.message);
//                if (scrapingPageInOwnTab === "true")
//                    newTabId = null;
//                endScrap(newTabId, scrapingPageInOwnTab);
//                return;
                resolve("noData");
            } else {
                chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
                    if (changeInfo.status === 'complete') {
                        chrome.tabs.sendMessage(tab.id, {
                            action: "pageScraping",
                            data: levelStructureMap,
                            rowNbr: rowNbr,
                            requestLatency: requestLatency
                        }, function (response) {
                            lastError = chrome.runtime.lastError;
                            if (lastError) {
//                                alert(extensionLang.ScrapingError + " (in response)\n" + lastError.message);
//                                if (scrapingPageInOwnTab === "true")
//                                    newTabId = null;
//                                endScrap(newTabId, scrapingPageInOwnTab);
//                                return;
                                resolve("noData");
                            } else {
                                if (response.data != "") {
                                    rowNbr += response.responseData.length;
                                    resolve(response.responseData);
                                } else {
//                                    reject("failed");
                                    resolve("noData");
                                }
                                chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                            }
                        });
                    }
                });
            }
        });
    });
}

// function updatePaginationScraping(newTabId, url, pagination) {
//     return new Promise(function (resolve, reject) {
//         chrome.tabs.update(newTabId, {
//             url: url
//         }, function (tab) {
//             chrome.tabs.onUpdated.addListener(function tabUpdatedListener(tabId, changeInfo, tab) {
//                 if (changeInfo.status === 'complete') {
//                     chrome.tabs.sendMessage(tab.id, {
//                         action: "paginationScraping",
//                         data: pagination
//                     }, function (response) {
//                         var lastError = chrome.runtime.lastError;
//                         if (lastError) {
// //                            console.log("lastError.message", lastError.message);
//                             // 'Could not establish connection. Receiving end does not exist.'
// //                            return;
//                             resolve("noData");
//                         } else {
//                             if (response.data != "")
//                                 resolve(response.responseData);
//                             else {
//                                 resolve("noData");
//     //                            reject("failed");
//                             }
//                         }
//                         chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
//                     });
//                 }
//             });
//         });
//     });
// }
