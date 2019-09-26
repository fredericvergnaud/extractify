function addDepth(depthTagClass, row) {
    var depth = new Depth();
    depth.id = row.id;
    depth.tagClass = depthTagClass;
    row.depth = depth;
    saveLevelsArray();
    return depth;
}

function removeDepth(depth, row, level) {
    removeHighlightedElement(level.tabId, depth);
    row.depth = null;
    if (getDepthNbr(level) === 0)
        removeLevelsAbove(level.id);
    level.someDeeperLinks = [];
    saveLevelsArray();
}
