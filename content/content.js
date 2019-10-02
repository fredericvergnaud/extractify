function getRowsStyles() {
    let styleTag = document.getElementById("rowsStylesCSS");
    if (styleTag !== null)
        return true;
    else
        return false;
}

function getColsDepthsStyles() {
    let styleTag = document.getElementById("colsStylesCSS");
    if (styleTag !== null)
        return true;
    else
        return false;
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        console.log("message from bg : " + message.action);
        var hasRowsStyles = getRowsStyles();
        var hasColsDepthsStyles = getColsDepthsStyles();
        console.log("hasRowsStyles : " + hasRowsStyles + " | hasColsDepthsStyles : " + hasColsDepthsStyles);
        switch (message.action) {
            case "selectRows":
                var level = message.level;
                if (!hasRowsStyles)
                    injectRowsStyles(level);
                var rowId = message.data["rowId"];
                selectRows(rowId, level)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedRows",
                            responseData: response
                        });
                    });
                break;
            case "highlightContent":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var level = message.data;
                if (!hasRowsStyles)
                    injectRowsStyles(level);
                highlightContent(level);
                break;
            case "highlightRows":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var level = message.level;
                var rowTagClass = message.rowTagClass;
                var rowId = message.rowId;
                if (!hasRowsStyles)
                    injectRowsStyles(level);
                highlightRows(rowTagClass, rowId)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedRows",
                            responseData: response
                        });
                    });
                break;
            case "removeHighlightedElement":
                var element = message.data;
                removeHighlightedElement(element);
                break;
            case "selectCols":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var row = message.data["row"];
                var globalColId = message.data["globalColId"];
                selectCols(row, globalColId)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedCols",
                            responseData: response
                        });
                    });
                break;
            case "highlightCols":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var row = message.row;
                var colTagClass = message.colTagClass;
                var colId = message.colId;
                highlightCols(row, colTagClass, colId)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedCols",
                            responseData: response
                        });
                    });
                break;
            case "selectDepth":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var row = message.data["row"];
                selectDepth(row)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedDepth",
                            responseData: response
                        });
                    });
                break;
            case "highlightDepth":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var row = message.row;
                var depthTagClass = message.depthTagClass;
                highlightDepth(row, depthTagClass)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedDepth",
                            responseData: response
                        });
                    });
                break;
            case "selectPagination":
                selectPagination()
                    .then(function (response) {
                        sendResponse({
                            response: "selectedPagination",
                            responseData: response
                        });
                    });
                break;
            case "highlightPagination":
                var level = message.level;
                var paginationTagClass = message.paginationTagClass;
                highlightPagination(level, paginationTagClass)
                    .then(function (response) {
                        sendResponse({
                            response: "selectedPagination",
                            responseData: response
                        });
                    });
                break;
            case "matchPaginationPrefixAndStep":
                var prefix = message.prefix;
                var step = message.step;
                matchPaginationPrefixAndStep(prefix, step)
                    .then(function (response) {
                        sendResponse({
                            response: "foundInvariant",
                            responseData: response
                        });
                    });
                break;
            case "levelScrapping":
                var levelStructureMap = new Map(message.data);
                var rowNbr = message.rowNbr;
                var scrappedLevel = getScrappedLevel(levelStructureMap, rowNbr);
                sendResponse({
                    response: "scrappedLevel",
                    responseData: [...scrappedLevel]
                });
                break;
            case "paginationScrapping":
                var pagination = message.data;
                var paginationLinks = getPaginationLinks(pagination);
                sendResponse({
                    response: "paginationLinks",
                    responseData: paginationLinks
                });
                break;
            case "stopContentSelect":
                var level = message.data;
                stopContentSelect(level)
                    .then(function (response) {
                        sendResponse({
                            response: "contentSelectStopped"
                        });
                    });
                break;
        }
        return true;
    });
