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
  function(message, sender, sendResponse) {
    console.log("message from bg : " + message.action);
    var hasRowsStyles = getRowsStyles();
    var hasColsDepthsStyles = getColsDepthsStyles();
    console.log("hasRowsStyles : " + hasRowsStyles + " | hasColsDepthsStyles : " + hasColsDepthsStyles);
    // On supprime tous les renvois de liens
    $('a').on('click', function(e) {
      e.preventDefault();
    });

    switch (message.action) {
      case "highlightContent":
        if (!hasColsDepthsStyles)
          injectColsDepthsStyles();
        var level = message.data;
        if (!hasRowsStyles)
          injectRowsStyles(level);
        // row
        var rows = level.rows;
        var rowsSelectors = "";
        for (row of level.rows)
          rowsSelectors += row.selector + ",";
        rowsSelectors = rowsSelectors.substring(0, rowsSelectors.length - 1);
        console.log("rowsSelectors : ", rowsSelectors);

        var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

        function checkForJS_Finish() {
          if (rowsSelectors !== "" && $(rowsSelectors).length > 0) {
            console.log("rowsSelectors found ! ");
            clearInterval(jsInitChecktimer);
            highlightContent(level);
          }
        }
        break;
      case "selectRows":
        var level = message.level;
        if (!hasRowsStyles)
          injectRowsStyles(level);
        var rowId = message.data["rowId"];
        selectRows(rowId, level)
          .then(function(response) {
            sendResponse({
              response: "selectedRows",
              responseData: response
            });
          });
        break;
      case "highlightRows":
        if (!hasColsDepthsStyles)
          injectColsDepthsStyles();
        var level = message.level;
        var rowSelector = message.rowSelector;
        var rowId = message.rowId;
        if (!hasRowsStyles)
          injectRowsStyles(level);
        highlightRows(rowSelector, rowId, level)
          .then(function(response) {
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
          .then(function(response) {
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
        var colSelector = message.colSelector;
        var colId = message.colId;
        var level = message.level;
        highlightCols(row, colSelector, colId, level)
          .then(function(response) {
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
          .then(function(response) {
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
        var depthSelector = message.depthSelector;
        highlightDepth(row, depthSelector)
          .then(function(response) {
            sendResponse({
              response: "selectedDepth",
              responseData: response
            });
          });
        break;
      case "selectPagination":
        selectPagination()
          .then(function(response) {
            sendResponse({
              response: "selectedPagination",
              responseData: response
            });
          });
        break;
      case "highlightPagination":
        var level = message.level;
        var paginationSelector = message.paginationSelector;
        highlightPagination(level, paginationSelector)
          .then(function(response) {
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
          .then(function(response) {
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
          var rowsSelectors = "";
          for (const [key, value] of levelStructureMap.entries()) {
            console.log("key : " + key);
            rowsSelectors += key + ",";
          }
          rowsSelectors = rowsSelectors.substring(0, rowsSelectors.length - 1);
          console.log("rowsSelectors : ", rowsSelectors);

          var requestLatencyMs = requestLatency * 1000;
          var jsInitChecktimer = setInterval(scrap_checkForJS_Finish, requestLatencyMs);

          function scrap_checkForJS_Finish() {
            if ($(rowsSelectors).length > 0) {
              console.log("rowsSelectors found ! ");
              clearInterval(jsInitChecktimer);
              var scrapedPage = getScrapedPage(levelStructureMap, rowNbr);
              sendResponse({
                response: "scrapedPage",
                responseData: [...scrapedPage]
              });
            } else {
              console.log("rowsSelectors NOT found");
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
          .then(function(response) {
            sendResponse({
              response: "contentSelectStopped"
            });
          });
        break;
    }
    return true;
  });
