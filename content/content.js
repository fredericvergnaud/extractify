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
                // row
                var rows = level.rows;
                var rowsTagClasses = "";
                for (row of level.rows)
                    rowsTagClasses += row.tagClass + ",";
                rowsTagClasses = rowsTagClasses.substring(0, rowsTagClasses.length - 1);
                console.log("rowsTagClasses : ", rowsTagClasses);

                var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

                function checkForJS_Finish() {
                    if (rowsTagClasses !== "" && $(rowsTagClasses).length > 0) {
                        console.log("rowsTagClasses found ! ");
                        clearInterval(jsInitChecktimer);
                        highlightContent(level);
                    }
                }
                break;
            case "highlightRows":
                if (!hasColsDepthsStyles)
                    injectColsDepthsStyles();
                var level = message.level;
                var rowTagClass = message.rowTagClass;
                var rowId = message.rowId;
                if (!hasRowsStyles)
                    injectRowsStyles(level);
                highlightRows(rowTagClass, rowId, level)
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
                var level = message.level;
                highlightCols(row, colTagClass, colId, level)
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
            case "pageScraping":
                var levelStructureMap = new Map(message.data);
                console.log("levelStructureMap : ", levelStructureMap);
                var rowNbr = message.rowNbr;
                var requestLatency = message.requestLatency;
                console.log("rowNbr = " + rowNbr + " | requestLatency = " + requestLatency);
                if (requestLatency === 0) {
                    var scrapedPage = getScrapedPage(levelStructureMap, rowNbr);
                    sendResponse({
                        response: "scrapedPage",
                        responseData: [...scrapedPage]
                    });
                } else {
                    // rows
                    var rowsTagClasses = "";
                    for (const [key, value] of levelStructureMap.entries()) {
                        console.log("key : " + key);
                        rowsTagClasses += key + ",";
                    }
                    rowsTagClasses = rowsTagClasses.substring(0, rowsTagClasses.length - 1);
                    console.log("rowsTagClasses : ", rowsTagClasses);

                    var requestLatencyMs = requestLatency * 1000;
                    var jsInitChecktimer = setInterval(scrap_checkForJS_Finish, requestLatencyMs);

                    function scrap_checkForJS_Finish() {
                        if ($(rowsTagClasses).length > 0) {
                            console.log("rowsTagClasses found ! ");
                            clearInterval(jsInitChecktimer);
                            var scrapedPage = getScrapedPage(levelStructureMap, rowNbr);
                            sendResponse({
                                response: "scrapedPage",
                                responseData: [...scrapedPage]
                            });
                        } else {
                            console.log("rowsTagClasses NOT found");
                            sendResponse({
                                response: "scrapedPage",
                                responseData: "noData"
                            });
                        }
                    }

                }
                break;
            case "paginationScraping":
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
