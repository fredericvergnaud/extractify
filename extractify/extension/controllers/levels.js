function getRemainingLevelTypes() {
    let usedLevelTypesKeys = [];
    for (let i = 0; i < levels.length; i++) {
        let usedLevel = levels[i];
        let usedLevelTypeKey = usedLevel.type;
        usedLevelTypesKeys.push(usedLevelTypeKey);
    }
    console.log("usedLevelTypesKeys : " + usedLevelTypesKeys);

    let levelTypesKeys = Object.keys(levelTypes);

    let newLevelTypesKeys = levelTypesKeys.filter(function (key) {
        return usedLevelTypesKeys.indexOf(key) < 0;
    });

    console.log("newLevelTypesKeys après filter : " + newLevelTypesKeys);

    let newLevelTypes = {};
    for (let i = 0; i < newLevelTypesKeys.length; i++)
        newLevelTypes[newLevelTypesKeys[i]] = levelTypes[newLevelTypesKeys[i]];
    console.log("newLevelTypes : ");
    console.log(newLevelTypes);

    return newLevelTypes;
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
    console.log("getDepthNbr : depth nbr = " + depthNbr);
    return depthNbr;
}

function makeTextFile(text) {
    var textFile = null;
    var data = new Blob([text], {
        type: 'text/plain'
    });
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
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

function readJsonFile(event) {
    var fileList = this.files;
    var selectedFile = fileList[0];
    if (selectedFile != undefined) {
        console.log("selected file : " + selectedFile.name);
        var reader = new FileReader();
        var newLevels;
        reader.onload = function (e) {
            try {
                newLevels = JSON.parse(reader.result);
                dejsonize(newLevels);
            } catch (error) {
                alert("Erreur de lecture du fichier json : \n" + error);
                return;
            }
        }
        reader.readAsText(selectedFile);
    }
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.status === 'complete') {
        //        console.log("handleUpdated : tab " + tabId + " updated complete");
        for (let level of levels) {
            var levelTabId = level.tabId;
            if (levelTabId === tabId)
                highlightContent(tabId, level);
        }
    }
}


function dejsonize(newLevels) {
    console.log("newLevels length = " + newLevels.length);
    console.log("levels length = " + levels.length);
    // on efface levels en cours
    var levelsToRemove = [];
    if (levels.length > 0) {
        for (var i = 0; i < levels.length; i++) {
            var level = levels[i];
            levelsToRemove.push(level);
        }
        removeLevels(levelsToRemove);
    }
    // on ajoute les nouveaux
    levels = newLevels;
    levels.forEach(function (level) {
        // on crée un nouveau tab
        createNewTab(level.url)
            .then(function (tabId) {
                console.log("response : tabId = " + tabId);
                console.log("Affectation de " + tabId + " à level.tabId");
                level.tabId = tabId;
                loadLevel(level);
                chrome.tabs.onUpdated.addListener(handleUpdated);
            });
    });
}

function loadLevel(level) {
    console.log("load du level " + level.id + " de tabId " + level.tabId);
    displayLevel(level);
    // global globalLevelId
    globalLevelId++;

    // Pagination
    if (level.pagination != null) {
        displayPagination(level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
    }
    // Rows, cols, depth   
    for (let row of level.rows) {
        // global globalRowId
        globalRowId++;
        displayRow(row, level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
        for (let col of row.cols) {
            // global globalColId
            globalColId++;
            fillColTitles(col.titleKey, col.title, level.type);
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

function fillColTitles(colTitleKey, colTitle, levelType) {
    if (levelType === "forum") {
        if (!(colTitleKey in forumColTitles))
            forumColTitles[colTitleKey] = colTitle;
    } else if (levelType === "topic") {
        if (!(colTitleKey in topicColTitles))
            topicColTitles[colTitleKey] = colTitle;
    } else if (levelType === "message") {
        if (!(colTitleKey in messageColTitles))
            messageColTitles[colTitleKey] = colTitle;
    }
    console.log("forumColTitles : ");
    console.log(forumColTitles);
    console.log("topicColTitles : ");
    console.log(topicColTitles);
    console.log("messageColTitles : ");
    console.log(messageColTitles);
}

// SCRAPPING 

function getLevelStructureMap(level) {
    let levelStructureMap = new Map();
    let rows = level.rows;
    for (let row of rows) {
        let rowTagClass = row.tagClass;
        let cols = row.cols;
        for (let col of cols) {
            //            var colTagClasses = "";
            //            if (col.tagClass.indexOf(",") !== -1) {
            //                let colClasses = col.tagClass.split(",");
            //                for (colClass of colClasses)
            //                    colTagClasses += col.tagClass + ",";
            //                colTagClasses = colTagClasses.substr(0, colTagClasses.length - 1);
            //            } else
            //                colTagClasses = col.tagClass;
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

function displayScrappingResults() {
    if (forums.size > 0) {
        for (let [forumUrl, forum] of forums) {
            console.log("Forum (" + forum.url + " | " + forum.topics.size + " topics)");
            Object.keys(forum).forEach(function (key, index) {
                if (forum[key] !== undefined)
                    console.log("\t" + key + " : " + forum[key]);
            });
            if (forum.topics.size > 0) {
                for (let [topicUrl, topic] of forum.topics) {
                    console.log("\t\tTopic (" + topic.url + " | " + topic.messages.length + " messages)");
                    Object.keys(topic).forEach(function (key, index) {
                        if (topic[key] !== undefined)
                            console.log("\t\t" + key + " : " + topic[key]);
                    });
                    if (topic.messages.length > 0) {
                        for (message of topic.messages)
                            Object.keys(message).forEach(function (key, index) {
                                if (message[key] !== undefined)
                                    console.log("\t\t" + key + " : " + message[key]);
                            });
                    }
                }
            }
        }
    } else if (forums.size === 0 && topics.size > 0) {
        for (let [topicUrl, topic] of topics) {
            console.log("\t\tTopic (" + topic.url + " | " + topic.messages.length + " messages)");
            Object.keys(topic).forEach(function (key, index) {
                if (topic[key] !== undefined)
                    console.log("\t\t" + key + " : " + topic[key]);
            });
            if (topic.messages.length > 0) {
                for (message of topic.messages)
                    Object.keys(message).forEach(function (key, index) {
                        if (message[key] !== undefined)
                            console.log("\t\t" + key + " : " + message[key]);
                    });
            }
        }
    } else if (forums.size === 0 && topics.size === 0 && messages.length > 0) {
        for (message of messages)
            Object.keys(message).forEach(function (key, index) {
                if (message[key] !== undefined)
                    console.log("\t\t" + key + " : " + message[key]);
            });
    } else
        console.log("NO SCRAPPED MESSAGES !!!");
}

function jsonizeScrapping() {
    var link = document.createElement('a');
    link.setAttribute('download', 'scrapping.json');
    if (forums.size > 0)
        link.href = makeTextFile(JSON.stringify([...forums.values()], null, "\t"));
    else if (forums.size === 0 && topics.size > 0)
        link.href = makeTextFile(JSON.stringify([...topics.values()], null, "\t"));
    else if (forums.size === 0 && topics.size === 0 && messages.length > 0)
        link.href = makeTextFile(JSON.stringify(messages, null, "\t"));
    document.body.appendChild(link);
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}

// SCRAP LEVEL
let forums, topics, messages, paginationRootUrl;

function initScrapping() {
    forums = new Map();
    topics = new Map();
    messages = [];
    paginationRootUrl = null;
    initScrappingResultsDialog();
}

// delayedUpdateTabForLevelScrapping et scrapLevel sont 2 fonctions asynchrones dont on attend la résolution avant de continuer (await)
// processUrls : traitement du tableau d'urls dans le nouvel ongvar tabId récupéré de createNewTab

async function scrapLevels(tabId, levels) {
    for (const level of levels) {
        let urls = [];
        if (level.type === "topic" && forums.size > 0)
            urls = [...forums.keys()];
        else if (level.type === "message" && topics.size > 0)
            urls = [...topics.keys()];
        else
            urls.push(level.url);
        await scrapLevel(tabId, urls, [...getLevelStructureMap(level)], level.type, level.pagination);
    }
}
let rowNbr = 0;

async function scrapLevel(tabId, urls, levelStructureMap, levelType, pagination) {
    for (const url of urls) {
        console.log("level : try with url = " + url);
        await delayedUpdateTabForLevelScrapping(tabId, url, levelStructureMap, levelType, pagination);
    }
    // le traitement des urls est terminé
    console.log('level urls process done!');
}

async function delayedUpdateTabForLevelScrapping(tabId, url, levelStructureMap, levelType, pagination) {
    // levelScrapping est la réponse envoyée par le resolve de updateNewTab qui est une Promise
    try {
        await updateLevelScraping(tabId, url, levelStructureMap)
            .then(function (levelScrapping) {
                console.log("delayedUpdateTabForLevelScrapping levelScrapping :");
                console.log(levelScrapping);
                processLevelScrapping(levelScrapping, levelType, url);
                if (pagination != null) {
                    console.log("Après scrapping de " + url + ", on va scrapper des liens de pagination");
                    let paginationLinks = [];
                    let paginationTagClass = pagination.tagClass;
                    return scrapPagination(tabId, url, paginationTagClass, levelStructureMap, levelType);
                } else
                    console.log("Après scrapping de " + url + ", pas de pagination");
            });
    } catch (error) {
        console.log("error de scrap level : " + error);
        alert("Level scrapping error : " + error);
        return;
    }
}

// SCRAP PAGINATION

async function scrapPagination(tabId, url, paginationTagClass, levelStructureMap, levelType) {
    console.log("pagination : try with url = " + url);
    await delayedUpdateTabForPaginationScrapping(tabId, url, paginationTagClass, levelStructureMap, levelType);
    // le traitement des urls est terminé
    console.log('pagination url process done!');
}

async function delayedUpdateTabForPaginationScrapping(tabId, url, paginationTagClass, levelStructureMap, levelType) {
    // paginationScrapping est la réponse envoyée par le resolve de updateNewTab qui est une Promise
    try {
        await updatePaginationScraping(tabId, url, paginationTagClass)
            .then(function (paginationScrapping) {
                console.log("updatePaginationScraping paginationScrapping :");
                console.log(paginationScrapping);
                paginationRootUrl = url;
                return scrapLevel(tabId, paginationScrapping, levelStructureMap, levelType, null);
            });
    } catch (error) {
        console.log("error de scrap pagination: " + error);
        return;
    }
}

function processLevelScrapping(result, levelType, rootUrl) {
    let resultMap = new Map(result);
    if (levelType === "forum") {
        for (let [url, children] of resultMap) {
            let forum = new Forum();
            for (let child in children) {
                for (let key in forumColTitles)
                    if (child === key)
                        forum[key] = children[child];
                if (child === "url")
                    forum.url = children[child];
            }
            forums.set(url, forum);
            updateScrappingResultsDialog(forums.size, levelType);
        }
    } else if (levelType === "topic") {
        let forumTopics = new Map();
        for (let [url, children] of resultMap) {
            let topic = new Topic();
            for (let child in children) {
                for (let key in topicColTitles)
                    if (child === key)
                        topic[key] = children[child];
                if (child === "url")
                    topic.url = children[child];
            }
            forumTopics.set(url, topic);
            topics.set(url, topic);
            updateScrappingResultsDialog(topics.size, levelType);
        }
        console.log("topics récupérés " + forumTopics.size);
        console.log("topics passe à " + topics.size);

        if (levels[0].type === "forum") {
            // dans le cas de pagination, la root url ne correspond pas à l'url du forum
            // dans ce cas, on utilise la paginationRootUrl
            if (paginationRootUrl !== null)
                rootUrl = paginationRootUrl;

            // on parcours les forums pour trouver la rootUrl
            for (forumRootUrl of forums.keys()) {
                if (forumRootUrl === rootUrl) {
                    let targetForum = forums.get(rootUrl);
                    for (let [url, topic] of forumTopics)
                        targetForum.topics.set(url, topic);
                }
            }
        }
    } else if (levelType === "message") {
        let topicMessages = [];
        for (var [url, children] of resultMap) {
            let message = new Message();
            for (child in children)
                for (let key in messageColTitles)
                    if (child === key)
                        message[key] = children[child].replace(/\s+/g, ' ').replace(/[\n\r]/g, '').trim();
            topicMessages.push(message);
            messages.push(message);
            updateScrappingResultsDialog(messages.length, levelType);
        }
        console.log("messages récupérés " + topicMessages.length);
        console.log("messages passe à " + messages.length);
        // dans le cas de pagination, la root url ne correspond pas à l'url du topic
        // dans ce cas, on utilise la paginationRootUrl
        if (paginationRootUrl !== null)
            rootUrl = paginationRootUrl;

        if (levels[0].type === "forum" && levels[1].type === "topic") {
            // on parcours les forums pour trouver la rootUrl
            for (let [url, forum] of forums) {
                let forumTopics = forum.topics;
                for (let [url, topic] of forumTopics) {
                    let topicRootUrl = topic.url;
                    if (topicRootUrl === rootUrl)
                        for (topicMessage of topicMessages)
                            topic.messages.push(topicMessage);
                }
            }
        } else if (levels[0].type === "topic") {
            for (let [url, topic] of topics) {
                let topicRootUrl = topic.url;
                if (topicRootUrl === rootUrl)
                    for (topicMessage of topicMessages)
                        topic.messages.push(topicMessage);
            }
        }
    }
}

function endScrap(tabId) {
    jsonizeScrapping();
    chrome.tabs.remove(tabId, function () {});
}
