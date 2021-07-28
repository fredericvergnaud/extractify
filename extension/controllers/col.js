function addCol(colSelector, colId, colTitleArray, row) {
    var col = new Col();
    col.id = colId;
    col.selector = colSelector;
    col.titleKey = colTitleArray[0];
    col.title = colTitleArray[1];
    row.cols.push(col);
    globalColId++;
    saveLevelsArray();
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
