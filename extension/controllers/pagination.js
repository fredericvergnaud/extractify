function addPagination(paginationSelector, paginationConstantUrl, paginationStart, paginationStep, paginationStop, level) {
    var pagination = new Pagination();
    pagination.selector = paginationSelector;
    pagination.constantUrl = paginationConstantUrl;
    pagination.start = Number(paginationStart);
    pagination.step = Number(paginationStep);
    pagination.stop = Number(paginationStop);
    level.pagination = pagination;
//    console.log("Nouvelle pagination : " + pagination.dataType + ", " + pagination.selector);
    saveLevelsArray();
    return pagination;
}

function removePagination(level) {
    removeHighlightedElement(level.tabId, level.pagination);
    level.pagination = null;
    saveLevelsArray();
}
