// Dialogue de sélection d'un level type
function selectLevelType() {
  let defer = $.Deferred();
  $("#level_type_select_wrapper").dialog({
    autoOpen: true,
    height: 210,
    width: 250,
    modal: true,
    buttons: {
      Select: {
        text: "Select this level type",
        id: "levelTypeSelectId", // id for hotkey
        click: function() {
          console.log("select clicked");
          let levelType = $("#level_type").val();
          let levelTypeArray = [],
            levelTypeKey;
          if (levelType !== "") {
            // nettoyage
            // replace des espaces
            levelType = levelType.replace(/\s+/g, ' ');
            // replace des return
            levelType = levelType.replace(/[\n\r]/g, '');
            // trim
            levelType = levelType.trim();
            // 1ère lettre en capitale
            levelType = levelType.charAt(0).toUpperCase() + levelType.slice(1);
            // key
            levelTypeKey = levelType.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, "_");
            levelTypeArray.push(levelTypeKey, levelType);
            defer.resolve(levelTypeArray);
            $(this).dialog("close");
            $(this).dialog("destroy");
            $(this).css("display", "none");
          } else {
            alert("Please give a level type name");
            return;
          }
        },
      },
      Cancel: {
        text: "Cancel",
        id: "levelTypeCancelId",
        click: function() {
          console.log("cancel clicked");
          // Add your code if you want to do something on close/cancel/exit
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#level_type_select_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#levelTypeSelectId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#levelTypeCancelId').click();
    return false;
  }
});

function selectRow() {
  let defer = $.Deferred();
  $("#add_row_wrapper").dialog({
    autoOpen: true,
    height: 250,
    width: 250,
    modal: true,
    buttons: {
      AddRow: {
        text: "Add row",
        id: "addRowId",
        click: function() {
          let rowSelector = $("#row_tag_class").val();
          if (rowSelector !== "") {
            // nettoyage
            // replace des espaces
            rowSelector = rowSelector.replace(/\s+/g, ' ');
            // replace des return
            rowSelector = rowSelector.replace(/[\n\r]/g, '');
            // trim
            rowSelector = rowSelector.trim();
          }
          defer.resolve(rowSelector);
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      },
      Cancel: {
        text: "Cancel",
        id: "addRowCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#add_row_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#addRowId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#addRowCancelId').click();
    return false;
  }
});

function selectCol() {
  let defer = $.Deferred();
  $("#add_col_wrapper").dialog({
    autoOpen: true,
    height: 250,
    width: 250,
    modal: true,
    buttons: {
      AddColumn: {
        text: "Add column",
        id: "addColId",
        click: function() {
          let colTitle = $("#col_title").val();
          let colSelector = $("#col_tag_class").val();
          let colArray = [],
            colTitleKey;
          if (colTitle !== "") {
            // nettoyage
            // replace des espaces
            colTitle = colTitle.replace(/\s+/g, ' ');
            // replace des return
            colTitle = colTitle.replace(/[\n\r]/g, '');
            // trim
            colTitle = colTitle.trim();
            // 1ère lettre en capitale
            colTitle = colTitle.charAt(0).toUpperCase() + colTitle.slice(1);
            // key
            colTitleKey = colTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, "_");
          }
          if (colSelector !== "") {
            // nettoyage
            // replace des espaces
            colSelector = colSelector.replace(/\s+/g, ' ');
            // replace des return
            colSelector = colSelector.replace(/[\n\r]/g, '');
            // trim
            colSelector = colSelector.trim();
          }
          if (colTitle !== "" && colSelector !== "") {
            colArray.push(colTitleKey, colTitle, colSelector);
            defer.resolve(colArray);
            $(this).dialog("close");
            $(this).dialog("destroy");
            $(this).css("display", "none");
          } else if (colTitle !== "" && colSelector === "") {
            colArray.push(colTitleKey, colTitle);
            defer.resolve(colArray);
            $(this).dialog("close");
            $(this).dialog("destroy");
            $(this).css("display", "none");
          } else {
            alert("Please give at least a column title");
            return;
          }
        }
      },
      Cancel: {
        text: "Cancel",
        id: "addColCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#add_col_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#addColId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#addColCancelId').click();
    return false;
  }
});

function selectDepth() {
  let defer = $.Deferred();
  $("#add_depth_wrapper").dialog({
    autoOpen: true,
    height: 250,
    width: 250,
    modal: true,
    buttons: {
      AddDepth: {
        text: "Add deeper level",
        id: "addDepthId",
        click: function() {
          let depthSelector = $("#depth_tag_class").val();
          if (depthSelector !== "") {
            // nettoyage
            // replace des espaces
            depthSelector = depthSelector.replace(/\s+/g, ' ');
            // replace des return
            depthSelector = depthSelector.replace(/[\n\r]/g, '');
            // trim
            depthSelector = depthSelector.trim();
          }
          defer.resolve(depthSelector);
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      },
      Cancel: {
        text: "Cancel",
        id: "addDepthCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#add_depth_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#addDepthId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#addDepthCancelId').click();
    return false;
  }
});

function selectPagination() {
  let defer = $.Deferred();
  $("#add_pagination_wrapper").dialog({
    autoOpen: true,
    height: 250,
    width: 250,
    modal: true,
    buttons: {
      AddPagination: {
        text: "Add pagination",
        id: "addPaginationId",
        click: function() {
          let paginationSelector = $("#pagination_tag_class").val();
          if (paginationSelector !== "") {
            // nettoyage
            // replace des espaces
            paginationSelector = paginationSelector.replace(/\s+/g, ' ');
            // replace des return
            paginationSelector = paginationSelector.replace(/[\n\r]/g, '');
            // trim
            paginationSelector = paginationSelector.trim();
          }
          defer.resolve(paginationSelector);
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      },
      Cancel: {
        text: "Cancel",
        id: "addPaginationCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#add_pagination_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#addPaginationId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#addPaginationCancelId').click();
    return false;
  }
});

function selectCustomPagination(pagination) {
  let defer = $.Deferred();
  $("#add_custom_pagination_wrapper").dialog({
    autoOpen: true,
    height: 300,
    width: 360,
    modal: true,
    buttons: {
      AddCustomPagination: {
        text: "Add custom pagination",
        id: "addCustomPaginationId",
        click: function() {
          let paginationConstantString = $("#add_custom_pagination_constantString").val();
          let paginationStart = $("#add_custom_pagination_start").val();
          let paginationStep = $("#add_custom_pagination_step").val();
          let paginationStop = $("#add_custom_pagination_stop").val();
          if (paginationConstantString !== "" && paginationStep !== "" && paginationStart !== "" && paginationStop !== "") {
            if (!$.isNumeric(paginationConstantString) && $.isNumeric(paginationStart) && $.isNumeric(paginationStep) && $.isNumeric(paginationStop)) {
              var countFourStars = (paginationConstantString.match(/\*\*\*\*/g) || []).length;
              console.log("countFourStars = ", countFourStars);
              if (!paginationConstantString.startsWith("http://") && !paginationConstantString.startsWith("https://")) {
                alert("Constant string must start with http:// or https://");
                return;
              } else if (countFourStars != 1) {
                alert("You must specify the variable number in constant string with '****' (4 stars)");
                return;
              } else if (Number(paginationStart) < 1) {
                alert("Start number must be stricly greater than 0");
                return;
              } else if (Number(paginationStart) >= Number(paginationStop)) {
                alert("Start number must be stricly less than Stop number");
                return;
              } else if (Number(paginationStep) < 1) {
                alert("Step number must be stricly greater than 0");
                return;
              } else if (Number(paginationStop) < 1) {
                alert("Stop number must be stricly greater than 0");
                return;
              } else if (Number(paginationStop) <= Number(paginationStart) + Number(paginationStep)) {
                alert("Stop number must be stricly greater than Start number + Step number");
                return;
              } else {
                let dataArray = [paginationConstantString, Number(paginationStart), Number(paginationStep), Number(paginationStop)];
                defer.resolve(dataArray);
                $(this).dialog("close");
                $(this).dialog("destroy");
                $(this).css("display", "none");
              }

            } else {
              alert("ConstantString must be a characters string & Start, Step and Stop must be numeric");
              return;
            }
          } else {
            alert("You must fill all the fields");
            return;
          }
        }
      },
      Cancel: {
        text: "Cancel",
        id: "addCustomPaginationCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#add_custom_pagination_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#addCustomPaginationId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#addCustomPaginationCancelId').click();
    return false;
  }
});

function selectDeeperLink() {
  var defer = $.Deferred();
  $("#select_deeper_links_wrapper").dialog({
    autoOpen: true,
    height: 200,
    width: 270,
    modal: true,
    buttons: {
      selectUrl: {
        text: "Select this url",
        id: "selectUrlId",
        click: function() {
          var selectDeeperLinks = document.getElementById('select_deeper_links_form');
          var levelUrl = selectDeeperLinks.options[selectDeeperLinks.selectedIndex].value;
          defer.resolve(levelUrl);
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      },
      Cancel: {
        text: "Cancel",
        id: "selectUrlCancelId",
        click: function() {
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
  return defer.promise();
}

$('#select_deeper_links_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#selectUrlId').click();
    return false;
  } else if (e.keyCode == $.ui.keyCode.ESCAPE) {
    $('#selectUrlIdCancelId').click();
    return false;
  }
});

function openScrapingResultsDialog(tabId) {
  console.log("Dialog results scraping open with tabId = " + tabId + " and stopScraping = " + stopScraping);
  $("#scraping_results_wrapper").dialog({
    autoOpen: true,
    height: 200,
    width: 270,
    modal: true,
    buttons: {
      "Cancel": function() {
        console.log("Scraping cancel button clicked")
        stopScraping = 1;
        // $(this).dialog("close");
        // $(this).dialog("destroy");
        // $(this).css("display", "none");
      }
    },
    dialogClass: "custom-dialog"
  });
}

// dialogue de select content
function selectContentDialog(level) {
  $("#select_content_dialog_wrapper").dialog({
    autoOpen: true,
    height: 0,
    width: 0,
    modal: true,
    buttons: {
      "Cancel": function() {
        stopContentSelect(level);
        $(this).dialog("close");
        $(this).dialog("destroy");
        $(this).css("display", "none");
      }
    },
    dialogClass: "custom-dialog"
  });
}

// Dialogue d'options
function selectOptions() {
  $("#options_select_wrapper").dialog({
    autoOpen: true,
    height: 200,
    width: 300,
    modal: true,
    buttons: {
      Save: {
        text: "Save",
        id: "saveOptionsId",
        click: function() {
          setOptions();
          $(this).dialog("close");
          $(this).dialog("destroy");
          $(this).css("display", "none");
        }
      }
    },
    dialogClass: "custom-dialog"
  });
}

$('#options_select_wrapper').keypress(function(e) {
  if (e.keyCode == $.ui.keyCode.ENTER) {
    $('#saveOptionsId').click();
    return false;
  }
});

// CHECKBOX SLIDER DANS OPTION //

$(function() {
  $("#scraping_page_in_own_tab_span").on("click", function() {
    if ($("#scraping_page_in_own_tab_input").is(":checked"))
      $("#scraping_page_in_own_tab_input").attr("value", false);
    else
      $("#scraping_page_in_own_tab_input").attr("value", true);
  });
});
