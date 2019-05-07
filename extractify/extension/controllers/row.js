function addRow(rowTagClass, rowColor, rowId, level) {
    var row = new Row();
    row.id = rowId;
    row.tagClass = rowTagClass;
    row.color = rowColor;
    console.log("Nouveau row d'id " + row.id + " : " + row.dataType + " | " + row.tagClass + " | " + row.color);
    level.rows.push(row);
    globalRowId++;
    saveLevelsArray();
    console.log("rows du level " + level.id + " passe à " + level.rows.length);
    return row;
}

//function displayLevelRow(rowTagName, rowClassName, rowId, level) {
//    var row = addNewRow(rowTagName, rowClassName, rowId, level);
//    createRowWrapper(row, level);
//    displayRow(row, level);
//    updateLevelDetails(level);
//    
//    //alert("Structure de ligne ajoutée");
//}

function removeRow(row, level) {
    
    // On supprime l'élément row dans le tableau rows
    var rows = level.rows;
    var newRows = rows.filter(function (el) {
        return el.id !== row.id;
    });
    level.rows = newRows; 
    console.log("tableau de rows après suppression passe à " + level.rows.length);
    
    // si plus aucun row :
    if (level.rows.length === 0) {
        // on enlève pagination si elle existe
        if (level.pagination !== null)
            removePagination(level);
        // on désactive bouton pagination
//        disablePaginationButton(level);
        // on désactive add level si il n'y a plus aucune cols et depth pour le level
        // on remove les levels supérieurs
        var colsNbr = getColsNbr(level);
        var depthNbr = getDepthNbr(level);
        if (colsNbr === 0 && depthNbr === 0) {
//            disableAddLevelButton();
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

