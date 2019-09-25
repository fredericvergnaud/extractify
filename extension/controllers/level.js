function getRowsNbr(level) {
    return level.rows.length;
}

function getColsNbr(level) {
    var colsNbr = 0;
    var rows = level.rows;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cols = row.cols;
        colsNbr += cols.length;
    }
    return colsNbr;
}

function getDepthNbr(level) {
    var depthNbr = 0;
    var rows = level.rows;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var depth = row.depth;
        var cols = row.cols;
        if (depth !== null && cols.length > 0)
            depthNbr += 1;
    }
    return depthNbr;
}

function getPaginationNbr(level) {
    if (level.pagination != null)
        return 1;
    else
        return 0;
}

function addLevel(levelId, levelTypeArray, levelUrl, levelTabId) {
    var level = new Level();
    level.id = levelId;
    level.url = levelUrl;
    level.typeKey = levelTypeArray[0];
    level.type = levelTypeArray[1];
    level.tabId = levelTabId;
    level.rows = [];
    level.pagination = null;
    levels.push(level);
    saveLevelsArray();
    globalLevelId++;
    return level;
}

function removeLevels(levelsToRemove) {
    // on commence par supprimer de l'interface
    removeLevelsTabs(levelsToRemove);
    // puis du browser
    removeBrowserTabs(levelsToRemove);
    // puis on supprime de levels
    for (var i = 0; i < levelsToRemove.length; i++) {
        globalLevelId--;
        var levelToRemove = levelsToRemove[i];
        var newLevels = levels.filter(function (element) {
            return element.id !== levelToRemove.id;
        });
        levels = newLevels;
    }
    saveLevelsArray();
    // check si il reste des rows, cols et depth pour remettre add level
    var lastLevel = levels[levels.length - 1];
    if (lastLevel !== undefined) {
        if (lastLevel.rows.length > 0) {
            var colsNbr = getColsNbr(lastLevel);
            var depthNbr = getDepthNbr(lastLevel);
            if (colsNbr > 0 && depthNbr > 0)
                enableAddLevelButton(lastLevel);
        }
    }
}

function saveLevelsArray() {
    chrome.storage.local.set({
        'levels': levels
    });
}

function compareLevelId(levelA, levelB) {
    if (levelA.id < levelB.id)
        return -1;
    if (levelA.id > levelB.id)
        return 1;
    return 0;
}

function getLevel(levelId) {
    var searchedLevel;
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        if (level.id == levelId) {
            searchedLevel = level;
            break;
        }
    }
    return searchedLevel;
}

function removeLevelsAbove(levelId) {
    var levelsToRemove = [];
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        if (level.id > levelId)
            levelsToRemove.push(level);
    }
    if (levelsToRemove.length > 0)
        removeLevels(levelsToRemove);
}

function removeLevel(levelId) {
    removeLevelsAbove(levelId - 1);
}
