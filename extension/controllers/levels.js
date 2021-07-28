function setOptions() {
    options = [];
    $('input[name="option"]').each(function () {
        console.log("option found : ", $(this).attr("id") + " : " + $(this).val());
        let option = new Option();
        option.name = $(this).attr('id');
        option.value = $(this).val();
        options.push(option);
    });
}

function getLevelsColsNbr() {
    var colsNbr = 0;
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        var rows = level.rows;
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            var cols = row.cols;
            colsNbr += cols.length;
        }
    }
    return colsNbr;
}

function getLevelsDepthNbr(level) {
    var depthNbr = 0;
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        var rows = level.rows;
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            var depth = row.depth;
            if (depth != null)
                depthNbr += 1;
        }
    }
    return depthNbr;
}

function makeTextFile(text) {
    var textFile = null;
    var data = new Blob([text], {
        type: 'text/plain'
    });
    if (textFile !== null)
        window.URL.revokeObjectURL(textFile);
    textFile = window.URL.createObjectURL(data);
    return textFile;
};

function jsonize() {
    var link = document.createElement('a');
    link.setAttribute('download', 'levels.json');
    link.href = makeTextFile(JSON.stringify(levels, null, "\t"));
    document.body.appendChild(link);
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

let globalLevelsIds, globalRowsIds, globalColsIds, dejsonizedLevels, dejsonizedRows, dejsonizedCols;

function readJsonFile() {
    var fileList = this.files;
    var selectedFile = fileList[0];
    if (selectedFile != undefined) {
        var reader = new FileReader();
        var newLevels;
        reader.onload = function (e) {
            try {
                newLevels = JSON.parse(reader.result);
                //                console.log("newLevels : ", newLevels);
                if (newLevels.length > 0) {
                    // test pour savoir si level ou pas
                    let firstLevel = newLevels[0];
                    if (firstLevel.id === undefined || firstLevel.typeKey === undefined || firstLevel.type === undefined || firstLevel.url === undefined || firstLevel.rows === undefined || firstLevel.pagination === undefined || firstLevel.tabId === undefined || firstLevel.someDeeperLinks === undefined) {
                        alert(extensionLang.InvalidJsonFile);
                        return;
                    } else {
                        globalLevelsIds = new Set();
                        globalRowsIds = new Set();
                        globalColsIds = new Set();
                        dejsonizedLevels = 0;
                        dejsonizedRows = 0;
                        dejsonizedCols = 0;
                        //    console.log("newLevels length = " + newLevels.length);
                        //    console.log("levels length = " + levels.length);
                        // on efface levels en cours
                        if (levels.length > 0) {
                            var levelsToRemove = [];
                            for (var i = 0; i < levels.length; i++) {
                                var level = levels[i];
                                levelsToRemove.push(level);
                            }
                            removeLevels(levelsToRemove);
                        }
                        // on ajoute les nouveaux
                        levels = newLevels;

                        // tests sur les ids pour détecter les doublons d'id
                        for (level of levels) {
                            // calcul des variables globales
                            globalLevelsIds.add(level.id);
                            dejsonizedLevels++;
                            if (level.rows.length > 0)
                                for (row of level.rows) {
                                    globalRowsIds.add(row.id);
                                    dejsonizedRows++;
                                    if (row.cols.length > 0)
                                        for (col of row.cols) {
                                            globalColsIds.add(col.id);
                                            dejsonizedCols++;
                                        }
                                }
                        }
                        if (globalLevelsIds.size !== dejsonizedLevels)
                            alert(extensionLang.LevelIdError);
                        else if (globalRowsIds.size !== dejsonizedRows)
                            alert(extensionLang.LevelRowsIdError);
                        else if (globalColsIds.size !== dejsonizedCols)
                            alert(extensionLang.LevelRowsColsIdError);
                        else {
                            // dejsonize
                            dejsonize(levels);
                            // affichage fichier
                            //                            console.log("selectedFile : ", selectedFile);
                            displayJsonFile(selectedFile);
                        }
                    }
                }
            } catch (error) {
                alert(extensionLang.JsonFileParseError + error);
                return;
            }
        }
        reader.readAsText(selectedFile);
    }
}

async function dejsonize(levels) {
    for (const level of levels) {
        // on crée un nouveau tab
        await createNewTab(level.url)
            .then(function (tabId) {
                console.log("level dejsonized in tab id " + tabId)
                level.tabId = tabId;
                loadLevel(level);
                highlightContent(tabId, level);
            })
            .then(function () {
                globalLevelsIdsTab = [...globalLevelsIds];
                globalLevelsIdsTab.sort((a, b) => a - b);
                globalLevelId = globalLevelsIdsTab[globalLevelsIdsTab.length - 1] + 1;

                globalRowsIdsTab = [...globalRowsIds];
                globalRowsIdsTab.sort((a, b) => a - b);
                globalRowId = globalRowsIdsTab[globalRowsIdsTab.length - 1] + 1;

                globalColsIdsTab = [...globalColsIds];
                globalColsIdsTab.sort((a, b) => a - b);
                globalColId = globalColsIdsTab[globalColsIdsTab.length - 1] + 1;
            });
    }
}

function displayJsonFile(file) {
    let dejsonized_file_wrapper = document.getElementById("dejsonized_file_wrapper");
    dejsonized_file_wrapper.innerHTML = file.name;
}

function removeDisplayedJsonFile() {
    let dejsonized_file_wrapper = document.getElementById("dejsonized_file_wrapper");
    dejsonized_file_wrapper.innerHTML = '';
}

function loadLevel(level) {
    fillLevelTypes(level.typeKey, level.type)
    displayLevel(level);

    // Pagination
    if (level.pagination != null) {
        displayPagination(level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
    }
    // Rows, cols, depth
    for (let row of level.rows) {
        displayRow(row, level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
        for (let col of row.cols) {
            fillColTitles(col.titleKey, col.title);
            displayCol(col, row, level);
            updateRowDisplay(row, level);
            updateLevelDisplay(level);
            updateLevelsDisplay();
        }
        if (row.depth != null) {
            displayDepth(row.depth, row, level);
            updateRowDisplay(row, level);
            updateLevelDisplay(level);
            updateLevelsDisplay();
        }
    }
}

function fillColTitles(colTitleKey, colTitle) {
    if (!(colTitleKey in colTitles))
        colTitles[colTitleKey] = colTitle;
}

function fillLevelTypes(levelTypeKey, levelType) {
    if (!(levelTypeKey in levelTypes))
        levelTypes[levelTypeKey] = levelType;
}

// SCRAPING

let rowNbr, scrapedObjects, objectsCount, stopScraping;

function initScraping() {
    rowNbr = 0;
    scrapedObjects = [];
    objectsCount = new Map();
    stopScraping = 0;
    initScrapingResultsDialog();
    errorsNbr = 0;
}

function getLevelStructureMap(level) {
    let levelStructureMap = new Map();
    let rows = level.rows;
    for (let row of rows) {
        let rowSelector = row.selector;
        let cols = row.cols;
        for (let col of cols) {
            let colSelector = col.selector;
            let colTitleKey = col.titleKey;
            var elemStructure = colTitleKey + "***" + colSelector;
            if (!levelStructureMap.has(rowSelector)) {
                var elemStructureArray = [elemStructure];
                levelStructureMap.set(rowSelector, elemStructureArray);
            } else {
                var elemStructureArray = levelStructureMap.get(rowSelector);
                elemStructureArray.push(elemStructure);
            }
        }
        if (row.depth !== null) {
            var depthSelector = row.depth.selector;
            var elemStructure = "url***" + depthSelector;
            if (!levelStructureMap.has(rowSelector)) {
                var elemStructureArray = [elemStructure];
                levelStructureMap.set(rowSelector, elemStructureArray);
            } else {
                var elemStructureArray = levelStructureMap.get(rowSelector);
                elemStructureArray.push(elemStructure);
            }
        }
    }
    //    console.log("levelStructureMap : ", levelStructureMap);
    return levelStructureMap;
}

function jsonizeScraping() {
    var link = document.createElement('a');
    link.setAttribute('download', 'scraping.json');
    if (scrapedObjects.length > 0)
        link.href = makeTextFile(JSON.stringify(scrapedObjects, null, "\t"));
    document.body.appendChild(link);
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

async function scrapLevels(tabId, requestLatency, scrapingPageInOwnTab) {
    for (const level of levels) {
        console.log("scrapLevels : level = " + level.id + " | stopScraping = " + stopScraping + " | requestLatency = " + requestLatency + " | scrapingPageInOwnTab = " + scrapingPageInOwnTab);
        if (stopScraping === 0) {
            // Scrap du LEVEL 0
            if (level.id === 0) {
                console.log("scrapLevels : Scraping of " + level.url + " with level id " + level.id + " in tab id " + tabId);
                console.log("scrapLevels : levels 0 : scrapedObjects lenght = " + scrapedObjects.length);
                await delayedUpdateTabForLevelScraping(tabId, level.url, level.id, scrapedObjects, requestLatency, scrapingPageInOwnTab)
            } else {
                console.log("scrapLevels : other levels : scrapedObjects lenght = " + scrapedObjects.length);
                for (const object of scrapedObjects) {
                    if (stopScraping === 0) {
                        console.log("scrapLevels : object url : " + object.url + " | object type : " + object.type);
                        if (scrapingPageInOwnTab === "true")
                            tabId = level.tabId;
                        console.log("scrapLevels : Scraping of " + object.url + " with level id " + level.id + " and level tab id " + tabId);
                        await delayedUpdateTabForLevelScraping(tabId, object.url, level.id, object.deeperLevel, requestLatency, scrapingPageInOwnTab)
                            .then(async function () {
                                if (getLevel(level.id + 1) !== undefined)
                                    await scrapLevel(tabId, level, object, requestLatency, scrapingPageInOwnTab);
                            });
                    } else {
                        console.log("scraping aborted");
                        return;
                    }
                }
            }
        } else {
            console.log("scraping aborted");
            return;
        }
    }
}

async function scrapLevel(tabId, level, object, requestLatency, scrapingPageInOwnTab) {
    console.log("scrapLevel : stopScraping = " + stopScraping + " | requestLatency = " + requestLatency + " | scrapingPageInOwnTab = " + scrapingPageInOwnTab);

    let levelIdSup = level.id + 1;
    for (const deeperLevelObject of object.deeperLevel) {
        if (stopScraping === 0) {
            console.log("scrapLevel : deeperLevelObject url : " + deeperLevelObject.url + " | deeperLevelObject type : " + deeperLevelObject.type);
            console.log("scrapLevel : Scraping of " + deeperLevelObject.url + " with level id " + levelIdSup + " in tab id " + tabId);
            await delayedUpdateTabForLevelScraping(tabId, deeperLevelObject.url, levelIdSup, deeperLevelObject.deeperLevel, requestLatency, scrapingPageInOwnTab)
                .then(async function () {
                    if (getLevel(levelIdSup + 1) !== undefined)
                        await scrapLevel(tabId, getLevel(levelIdSup + 1), deeperLevelObject, requestLatency, scrapingPageInOwnTab);
                });
        } else {
            console.log("scraping aborted");
            return;
        }
    }
}

async function delayedUpdateTabForLevelScraping(tabId, url, levelId, objectTab, requestLatency, scrapingPageInOwnTab) {
    // levelScrapping est la réponse envoyée par le resolve de updateNewTab qui est une Promise
    await updatePageScraping(tabId, url, [...getLevelStructureMap(levels[levelId])], requestLatency, scrapingPageInOwnTab)
        .then(function (pageScraping) {
            console.log("delayedUpdateTabForLevelScraping pageScraping :", pageScraping);
            if (pageScraping === "noData")
                errorsNbr++;
            return processPageScraping(pageScraping, levelId, objectTab);
        })
        .then(async function () {
            let level = getLevel(levelId);
            if (level.pagination !== null) {
                console.log("pagination not null ");
                await delayedUpdateTabForPaginationScraping(tabId, url, level, objectTab, requestLatency, scrapingPageInOwnTab);
            } else
                console.log("pagination null ");
        });
}

// SCRAP PAGINATION

async function delayedUpdateTabForPaginationScraping(tabId, url, level, objectTab, requestLatency, scrapingPageInOwnTab) {
    await updatePaginationScraping(tabId, url, level.pagination)
        .then(async function (paginationScraping) {
            if (paginationScraping === "noData")
                errorsNbr++;
            else {
                console.log("pagination length = " + paginationScraping.length, level.pagination);
                if (paginationScraping.length > 0) {
                    //                console.log("paginationScraping : ", paginationScraping);
                    for (const paginationUrl of paginationScraping)
                        await delayedUpdateTabForPaginationLevelScraping(tabId, paginationUrl, level.id, objectTab, requestLatency, scrapingPageInOwnTab);
                }
            }
        });
}

async function delayedUpdateTabForPaginationLevelScraping(tabId, url, levelId, objectTab, requestLatency, scrapingPageInOwnTab) {
    await updatePageScraping(tabId, url, [...getLevelStructureMap(levels[levelId])], requestLatency, scrapingPageInOwnTab)
        .then(function (pageScraping) {
            processPageScraping(pageScraping, levelId, objectTab)
        });
}

function processPageScraping(result, levelId, objectTab) {
    if (result !== "noData") {
        let resultMap = new Map(result);
        //        console.log("resultMap :", resultMap);
        for (let [url, children] of resultMap) {
            if (url !== null) {
                let object = new Object();
                object.type = levels[levelId].type;
                for (let child in children) {
                    for (let key in colTitles)
                        if (child === key)
                            object[key] = children[child].replace(/\s+/g, ' ').replace(/[\n\r]/g, '').trim();
                    if (child === "url")
                        object.url = children[child];
                }
                object.deeperLevel = [];
                objectTab.push(object);
                // update results
                if (objectsCount.has(object.type)) {
                    let i = objectsCount.get(object.type);
                    i++;
                    objectsCount.set(object.type, i);
                } else
                    objectsCount.set(object.type, 1);
                updateScrapingResultsDialog(object.type);
            }
        }
    } else {
        console.log("processLevelScraping : noData");
        return;
    }
}

function endScrap(tabId, scrapingPageInOwnTab) {
    console.log("endScrap : tabId = " + tabId + " | stopscraping = " + stopScraping + " | scrapingPageInOwnTab = " + scrapingPageInOwnTab);
    jsonizeScraping();
    if (scrapingPageInOwnTab === "false" && tabId !== null)
        chrome.tabs.remove(tabId);
    if (stopScraping === 0)
        closeScrapingResultsDialog();

}
