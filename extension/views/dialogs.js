// Dialogue de sélection d'un level type
function selectLevelType() {
    let defer = $.Deferred();
    $("#level_type_select_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 250,
        modal: true,
        buttons: {
            "Select this level type": function () {
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
                    $("#level_type_select_wrapper").dialog("destroy");
                    $("#level_type_select_wrapper").css("display", "none");
                } else {
                    alert("Please give a level type name");
                    return;
                }
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#level_type_select_wrapper").dialog("destroy");
                $("#level_type_select_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectRow() {
    let defer = $.Deferred();
    $("#add_row_wrapper").dialog({
        autoOpen: true,
        height: 250,
        width: 250,
        modal: true,
        buttons: {
            "Add row": function () {
                let rowTagClass = $("#row_tag_class").val();
                if (rowTagClass !== "") {
                    // nettoyage
                    // replace des espaces
                    rowTagClass = rowTagClass.replace(/\s+/g, ' ');
                    // replace des return
                    rowTagClass = rowTagClass.replace(/[\n\r]/g, '');
                    // trim
                    rowTagClass = rowTagClass.trim();
                }
                defer.resolve(rowTagClass);
                $(this).dialog("close");
                $("#add_row_wrapper").dialog("destroy");
                $("#add_row_wrapper").css("display", "none");
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#add_row_wrapper").dialog("destroy");
                $("#add_row_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}


function selectCol() {
    let defer = $.Deferred();
    $("#add_col_wrapper").dialog({
        autoOpen: true,
        height: 250,
        width: 250,
        modal: true,
        buttons: {
            "Add column": function () {
                let colTitle = $("#col_title").val();
                let colTagClass = $("#col_tag_class").val();
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
                if (colTagClass !== "") {
                    // nettoyage
                    // replace des espaces
                    colTagClass = colTagClass.replace(/\s+/g, ' ');
                    // replace des return
                    colTagClass = colTagClass.replace(/[\n\r]/g, '');
                    // trim
                    colTagClass = colTagClass.trim();
                }
                if (colTitle !== "" && colTagClass !== "") {
                    colArray.push(colTitleKey, colTitle, colTagClass);
                    defer.resolve(colArray);
                    $(this).dialog("close");
                    $("#add_col_wrapper").dialog("destroy");
                    $("#add_col_wrapper").css("display", "none");
                } else if (colTitle !== "" && colTagClass === "") {
                    colArray.push(colTitleKey, colTitle);
                    defer.resolve(colArray);
                    $(this).dialog("close");
                    $("#add_col_wrapper").dialog("destroy");
                    $("#add_col_wrapper").css("display", "none");
                } else {
                    alert("Please give at least a column title");
                    return;
                }
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#add_col_wrapper").dialog("destroy");
                $("#add_col_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectDepth() {
    let defer = $.Deferred();
    $("#add_depth_wrapper").dialog({
        autoOpen: true,
        height: 250,
        width: 250,
        modal: true,
        buttons: {
            "Add deeper level": function () {
                let depthTagClass = $("#depth_tag_class").val();
                if (depthTagClass !== "") {
                    // nettoyage
                    // replace des espaces
                    depthTagClass = depthTagClass.replace(/\s+/g, ' ');
                    // replace des return
                    depthTagClass = depthTagClass.replace(/[\n\r]/g, '');
                    // trim
                    depthTagClass = depthTagClass.trim();
                }
                defer.resolve(depthTagClass);
                $(this).dialog("close");
                $("#add_depth_wrapper").dialog("destroy");
                $("#add_depth_wrapper").css("display", "none");
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#add_depth_wrapper").dialog("destroy");
                $("#add_depth_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectPagination() {
    let defer = $.Deferred();
    $("#add_pagination_wrapper").dialog({
        autoOpen: true,
        height: 250,
        width: 250,
        modal: true,
        buttons: {
            "Add pagination": function () {
                let paginationTagClass = $("#pagination_tag_class").val();
                if (paginationTagClass !== "") {
                    // nettoyage
                    // replace des espaces
                    paginationTagClass = paginationTagClass.replace(/\s+/g, ' ');
                    // replace des return
                    paginationTagClass = paginationTagClass.replace(/[\n\r]/g, '');
                    // trim
                    paginationTagClass = paginationTagClass.trim();                    
                }
                defer.resolve(paginationTagClass);
                $(this).dialog("close");
                $("#add_pagination_wrapper").dialog("destroy");
                $("#add_pagination_wrapper").css("display", "none");
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#add_pagination_wrapper").dialog("destroy");
                $("#add_pagination_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectCustomPagination() {
    let defer = $.Deferred();
    $("#add_custom_pagination_wrapper").dialog({
        autoOpen: true,
        height: 250,
        width: 250,
        modal: true,
        buttons: {
            "Add custom pagination": function () {
                let paginationPrefix = $("#pagination_prefix").val();
                let paginationStep = $("#pagination_step").val();
                if (paginationPrefix !== "" && paginationStep !== "") {
                    if (!$.isNumeric(paginationPrefix) && $.isNumeric(paginationStep)) {
                        let dataArray = [paginationPrefix, Number(paginationStep)]
                        defer.resolve(dataArray);
                        $(this).dialog("close");
                        $("#add_custom_pagination_wrapper").dialog("destroy");
                        $("#add_custom_pagination_wrapper").css("display", "none");
                    } else {
                        alert("Prefix must be a characters string & Step must be numeric");
                        return;
                    }
                } else {
                    alert("You must fill all the fields");
                    return;
                }

            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#add_custom_pagination_wrapper").dialog("destroy");
                $("#add_custom_pagination_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}


function selectDeeperLink() {
    var defer = $.Deferred();
    $("#select_deeper_links_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 270,
        modal: true,
        buttons: {
            "Select this url": function () {
                var selectDeeperLinks = document.getElementById('select_deeper_links_form');
                var levelUrl = selectDeeperLinks.options[selectDeeperLinks.selectedIndex].value;
                defer.resolve(levelUrl);
                $(this).dialog("close");
                $("#select_deeper_links_wrapper").dialog("destroy");
                $("#select_deeper_links_wrapper").css("display", "none");
            },
            "Cancel": function () {
                $(this).dialog("close");
                $("#select_deeper_links_wrapper").dialog("destroy");
                $("#select_deeper_links_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function scrappingResults(tabId) {
    $("#scrapping_results_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 270,
        modal: true,
        buttons: {
            "Cancel": function () {
                endScrap(tabId);
                $(this).dialog("close");
                $("#scrapping_results_wrapper").dialog("destroy");
                $("#scrapping_results_wrapper").css("display", "none");
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
            "Cancel": function () {
                stopContentSelect(level);
                $(this).dialog("close");
                $("#select_content_dialog_wrapper").dialog("destroy");
                $("#select_content_dialog_wrapper").css("display", "none");
            }
        },
        dialogClass: "custom-dialog"
    });
}
