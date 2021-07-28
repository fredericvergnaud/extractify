function addPagination(paginationSelector, paginationPrefix, paginationStep, paginationLinks, level) {
    var pagination = new Pagination();
    pagination.selector = paginationSelector;
    pagination.prefix = paginationPrefix;
    pagination.step = Number(paginationStep);
    pagination.links = paginationLinks;
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
