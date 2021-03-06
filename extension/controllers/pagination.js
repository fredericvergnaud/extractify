function addPagination(paginationTagClass, paginationPrefix, paginationStep, level) {
    var pagination = new Pagination();
    pagination.tagClass = paginationTagClass;
    pagination.prefix = paginationPrefix;
    pagination.step = Number(paginationStep);
    level.pagination = pagination;
//    console.log("Nouvelle pagination : " + pagination.dataType + ", " + pagination.tagClass);
    saveLevelsArray();
    return pagination;
}

function removePagination(level) {
    removeHighlightedElement(level.tabId, level.pagination);
    level.pagination = null;
    saveLevelsArray();
}

