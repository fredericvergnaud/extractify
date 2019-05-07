function addDepth(depthTagClass, row) {
    var depth = new Depth();
    depth.id = row.id;
    depth.tagClass = depthTagClass;
    row.depth = depth;
    console.log("Nouvelle depth d'id " + depth.id + " : " + depth.dataType + ", " + depth.tagClass);
    saveLevelsArray();
    return depth;
}

//function displayRowDepth(selectedDepth, row, level) {
//    var depthStructure = selectedDepth.depthStructure;
//    var linksArray = selectedDepth.linksArray;
//    var depth = addNewDepth(depthStructure, linksArray, row);
//    createDepthWrapper(depth, row);
//    displayDepth(depth, row, level);
//     // mise à jour du panel level
//    updateLevelDetails(level);
//    // disable du bouton add depth
//    disableSelectDepthButton(row);
//    // enable du bouton add level si au moins 1 colonne
//    if (row.cols.length > 0)
//        enableAddLevelButton(level);
//    alert(linksArray.length + " liens vers une profondeur inférieure ont été ajouté");
//}

//function removeDepth(depth, row, level) {
//    console.log("function removeRowDepth : level id = " + level.id);
//    
//    removeDepth(row);
//    removeDepthWrapper(row);
//    saveLevelsArray();
//    updateLevelDetails(level);
//    // enable du bouton add depth
//    enableSelectDepthButton(row);
//    // disable du bouton add level si plus aucune cols et depth n'existe
//    var depthNbr = getDepthNbr(level);
//    if (depthNbr === 0) {
//        disableAddLevelButton(level);
//        removeLevelsAbove(level.id);
//    }
//}

function removeDepth(depth, row, level) {
    removeHighlightedElement(level.tabId, depth);
    row.depth = null;
    if (getDepthNbr(level) === 0)
        removeLevelsAbove(level.id);
    saveLevelsArray();
}
