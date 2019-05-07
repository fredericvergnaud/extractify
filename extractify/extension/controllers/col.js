function getRemainingColTitles(row, level) {
    let currentLevelType = level.type;
    console.log("currentLevelType = " + currentLevelType);
    // on sélectionne les titres de colonne selon le type
    $("#col_title_select").find('option').remove().end();
    let colTitles;
    if (currentLevelType === "forum")
        colTitles = forumColTitles;
    else if (currentLevelType === "topic")
        colTitles = topicColTitles;
    else if (currentLevelType === "message")
        colTitles = messageColTitles;
    let colTitlesKeys = Object.keys(colTitles);
    console.log("colTitlesKeys : " + colTitlesKeys);
    
    let cols = row.cols;
    let usedColTitlesKeys = [];
    for (let i = 0; i < cols.length; i++) {
        let col = cols[i];
        let usedColTitleKey = col.titleKey;
        usedColTitlesKeys.push(usedColTitleKey);
    }
    console.log("usedColTitlesKeys : " + usedColTitlesKeys);
    
    var newColTitlesKeys = colTitlesKeys.filter(function (key) {
        return usedColTitlesKeys.indexOf(key) < 0;
    });

    console.log("newColTitlesKeys après filter : " + newColTitlesKeys);
    
    let newColTitles = {};    
    for (let i = 0; i < newColTitlesKeys.length; i++)
        newColTitles[newColTitlesKeys[i]] = colTitles[newColTitlesKeys[i]];
    console.log("newColTitles : ");
    console.log(newColTitles);
    
    return newColTitles;
}

function addCol(colTagClass, colId, colTitleArray, row) {
    var col = new Col();
    col.id = colId;
    col.tagClass = colTagClass;
    col.titleKey = colTitleArray[0];
    col.title = colTitleArray[1];
    console.log("Nouvelle col d'id " + col.id + " : " + col.dataType + ", " + col.tagClass + ", " + col.titleKey + ", " + col.title);
    row.cols.push(col);
    globalColId++;
    saveLevelsArray();
    console.log("cols du row " + row.id + " passe à " + row.cols.length);
    return col;
}

function removeCol(col, row, level) {
    removeHighlightedElement(level.tabId, col);
    var cols = row.cols;
    var newCols = cols.filter(function (el) {
        return el.id !== col.id;
    });
    row.cols = newCols;
    if (getColsNbr(level) === 0 && getDepthNbr(level) === 0)
        removeLevelsAbove(level.id);
    saveLevelsArray();
}
