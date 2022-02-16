function addRow(rowSelector, rowColor, rowId, level) {
    var row = new Row();
    row.id = rowId;
    row.selector = rowSelector;
    row.color = rowColor;
    level.rows.push(row);
    globalRowId++;
    saveLevelsArray();
    return row;
}

function removeRow(row, level) {
    // On supprime l'élément row dans le tableau rows
    var rows = level.rows;
    var newRows = rows.filter(function (el) {
        return el.id !== row.id;
    });
    level.rows = newRows;

    // si plus aucun row :
    if (level.rows.length === 0) {
        // on enlève pagination si elle existe
        if (level.pagination !== null)
            removePagination(level);
        // on remove les levels supérieurs
        var colsNbr = getColsNbr(level);
        var depthNbr = getDepthNbr(level);
        if (colsNbr === 0 && depthNbr === 0) {
            removeLevelsAbove(level.id);
        }
    }

    // on supprime les highlight
    // row
    removeHighlightedElement(level.tabId, row);
    // cols
    var cols = row.cols;
    for (var i = 0; i < cols.length; i++)
        removeHighlightedElement(level.tabId, cols[i]);
    // on supprime le highlight de la depth si elle existe
    if (row.depth)
        removeHighlightedElement(level.tabId, row.depth);
    saveLevelsArray();
}
