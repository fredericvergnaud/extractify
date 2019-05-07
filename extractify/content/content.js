console.log("content.js : content_script loaded");

function getRowsStyles() {
    var hasRowsStyles = false;
    for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (sheet.title == "content-rows-dynamic-css") {
            hasRowsStyles = true;
            break;
        }
    }
    console.log("hasRowsStyles : " + hasRowsStyles);
    return hasRowsStyles;
}

function getColsDepthsStyles() {
    var hasColsDepthsStyles = false;
    for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (sheet.title == "content-cols-depths-dynamic-css") {
            hasColsDepthsStyles = true;
            break;
        }
    }
    console.log("hasColsDepthsStyles : " + hasColsDepthsStyles);
    return hasColsDepthsStyles;
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        console.log("message from bg : " + message.action + " with data :");
        console.log(message.data);
        var hasRowsStyles = getRowsStyles();
        var hasColsDepthsStyles = getColsDepthsStyles();
        switch (message.action) {
            case "selectRows":
                if (!hasRowsStyles)
                    injectRowsStyles();
                var rowId = message.data["rowId"];
                alert("Sélectionnez les lignes à récupérer");
                selectRows(rowId)
                    .then(function (response) {
                        console.log("response : ");
                        console.log(response);
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
                highlightContent(level);
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
                alert("Sélectionnez les informations à récupérer pour chaque ligne");
                selectCols(row, globalColId)
                    .then(function (response) {
                        console.log("response : ");
                        console.log(response);
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
                console.log("row id reçu = " + row.id);
                alert("Sélectionnez un lien vers une profondeur inférieure");
                selectDepth(row)
                    .then(function (response) {
                        console.log("response : ");
                        console.log(response);
                        sendResponse({
                            response: "selectedDepth",
                            responseData: response
                        });
                    });
                break;
            case "selectPagination":
                alert("Sélectionnez les informations de pagination");
                selectPagination()
                    .then(function (response) {
                        console.log("response : ");
                        console.log(response);
                        sendResponse({
                            response: "selectedPagination",
                            responseData: response
                        });
                    });
                break;
            case "levelScrapping":
                let levelStructureMap = new Map(message.data);
                let rowNbr = message.rowNbr;
                var scrappedLevel = getScrappedLevel(levelStructureMap, rowNbr);
                console.log("scrappedLevel : ");
                console.log(scrappedLevel);
                sendResponse({
                    response: "scrappedLevel",
                    responseData: [...scrappedLevel]
                });
                break;
            case "paginationScrapping":
                var paginationTagClass = message.data;
                var paginationLinks = getPaginationLinks(paginationTagClass);
                console.log("paginationLinks : ");
                console.log(paginationLinks);
                sendResponse({
                    response: "paginationLinks",
                    responseData: paginationLinks
                });
                break;
        }
        // réponse asynchrone
        return true;
    }
);
