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
                console.log("newLevels : ");
                console.log(newLevels);
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
                            dejsonize(newLevels);
                            // affichage fichier
                            console.log(selectedFile);
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

function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.status === 'complete') {
        for (let level of levels) {
            var levelTabId = level.tabId;
            if (levelTabId === tabId)
                highlightContent(tabId, level);
        }
    }
}

function dejsonize(newLevels) {
    for (const level of levels) {
        // on crée un nouveau tab
        createNewTab(level.url)
            .then(function (tabId) {
                level.tabId = tabId;
                loadLevel(level);
                chrome.tabs.onUpdated.addListener(handleUpdated);
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

// SCRAPPING 

let rowNbr, scrappedObjects, objectsCount;

function initScrapping() {
    rowNbr = 0;
    scrappedObjects = [];
    objectsCount = new Map();
    initScrappingResultsDialog();
}

function getLevelStructureMap(level) {
    let levelStructureMap = new Map();
    let rows = level.rows;
    for (let row of rows) {
        let rowTagClass = row.tagClass;
        let cols = row.cols;
        for (let col of cols) {
            let colTagClass = col.tagClass;
            let colTitleKey = col.titleKey;
            var elemStructure = colTitleKey + "***" + colTagClass;
            if (!levelStructureMap.has(rowTagClass)) {
                var elemStructureArray = [elemStructure];
                levelStructureMap.set(rowTagClass, elemStructureArray);
            } else {
                var elemStructureArray = levelStructureMap.get(rowTagClass);
                elemStructureArray.push(elemStructure);
            }
        }
        if (row.depth !== null) {
            var depthTagClass = row.depth.tagClass;
            var elemStructure = "url***" + depthTagClass;
            if (!levelStructureMap.has(rowTagClass)) {
                var elemStructureArray = [elemStructure];
                levelStructureMap.set(rowTagClass, elemStructureArray);
            } else {
                var elemStructureArray = levelStructureMap.get(rowTagClass);
                elemStructureArray.push(elemStructure);
            }
        }
    }
    return levelStructureMap;
}

function jsonizeScrapping() {
    var link = document.createElement('a');
    link.setAttribute('download', 'scrapping.json');
    if (scrappedObjects.length > 0)
        link.href = makeTextFile(JSON.stringify(scrappedObjects, null, "\t"));
    document.body.appendChild(link);
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

async function scrapLevels(tabId) {
    for (const level of levels) {
        console.log("level = " + level.id);
        // Scrap du LEVEL 0
        if (level.id === 0) {
            console.log("scrapLevels : Scrapping de " + level.url + " with level id " + level.id);
            console.log("levels 0 : scrappedObjects lenght = " + scrappedObjects.length);
            await delayedUpdateTabForLevelScrapping(tabId, level.url, level.id, scrappedObjects)
        } 
        else {
            console.log("levels autres : scrappedObjects lenght = " + scrappedObjects.length);
            for (const object of scrappedObjects) {
                console.log("scrapLevels : object url : " + object.url + " | object type : " + object.type);
                console.log("scrapLevels : Scrapping de " + object.url + " with level id " + level.id);
                await delayedUpdateTabForLevelScrapping(tabId, object.url, level.id, object.deeperLevel)
                    .then(async function () {
                        if (getLevel(level.id + 1) !== undefined)
                            await scrapLevel(tabId, level, object);
                    });

            }
        }
    }
}

async function scrapLevel(tabId, level, object) {
    let levelIdSup = level.id + 1;
    for (const deeperLevelObject of object.deeperLevel) {
        console.log("scrapLevel : deeperLevelObject url : " + deeperLevelObject.url + " | deeperLevelObject type : " + deeperLevelObject.type);
        console.log("scrapLevel : Scrapping de " + deeperLevelObject.url + " with level id " + levelIdSup);
        await delayedUpdateTabForLevelScrapping(tabId, deeperLevelObject.url, levelIdSup, deeperLevelObject.deeperLevel)
            .then(async function () {
                if (getLevel(levelIdSup + 1) !== undefined)
                    await scrapLevel(tabId, getLevel(levelIdSup + 1), deeperLevelObject);
            });
    }
}

async function delayedUpdateTabForLevelScrapping(tabId, url, levelId, objectTab) {
    // levelScrapping est la réponse envoyée par le resolve de updateNewTab qui est une Promise
    //    try {

    await updateLevelScraping(tabId, url, [...getLevelStructureMap(levels[levelId])])
        .then(function (levelScrapping) {
            //                console.log("delayedUpdateTabForLevelScrapping levelScrapping :");
            //                console.log(levelScrapping);
            return processLevelScrapping(levelScrapping, levelId, objectTab)
        })
        .then(async function () {
            let level = getLevel(levelId);
            console.log("pagination = " + level.pagination);
            if (level.pagination !== null)
                await delayedUpdateTabForPaginationScrapping(tabId, url, level, objectTab);
        });
    //    } catch (error) {
    //        //        console.log("error de scrap level : " + error);
    //        alert("Level scrapping error : " + error);
    //        return;
    //    }
}

// SCRAP PAGINATION

async function delayedUpdateTabForPaginationScrapping(tabId, url, level, objectTab) {
    //    try {
    await updatePaginationScraping(tabId, url, level.pagination)
        .then(async function (paginationScrapping) {
            console.log("pagination lenght = " + paginationScrapping.length);
            if (paginationScrapping.length > 0) {
                console.log("paginationScrapping : ");
                console.log(paginationScrapping);
                for (const paginationUrl of paginationScrapping)
                    await delayedUpdateTabForPaginationLevelScrapping(tabId, paginationUrl, level.id, objectTab);
            }
        });

    //    } catch (error) {
    //        //        console.log("error de scrap pagination: " + error);
    //        return;
    //    }
}

async function delayedUpdateTabForPaginationLevelScrapping(tabId, url, levelId, objectTab) {
    // levelScrapping est la réponse envoyée par le resolve de updateNewTab qui est une Promise
    //    try {

    await updateLevelScraping(tabId, url, [...getLevelStructureMap(levels[levelId])])
        .then(function (levelScrapping) {
            processLevelScrapping(levelScrapping, levelId, objectTab)
        });
    //    } catch (error) {
    //        //        console.log("error de scrap level : " + error);
    //        alert("Level scrapping error : " + error);
    //        return;
    //    }
}

function processLevelScrapping(result, levelId, objectTab) {
    let resultMap = new Map(result);
    console.log("resultMap :");
    console.log(resultMap);
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
            updateScrappingResultsDialog(object.type);
        }
    }
}

function endScrap(tabId) {
    jsonizeScrapping();
    chrome.tabs.remove(tabId, function () {});
}
