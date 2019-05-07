// Dialogue de sélection d'un type
function selectLevelType() {
    var defer = $.Deferred();
    $("#level_type_select_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 250,
        modal: true,
        buttons: {
            "Select this level type": function () {
                var levelType = $("#level_type_select").val();
                defer.resolve(levelType);
                $(this).dialog("close");
                $(".ui-dialog-content").dialog('destroy');
            },
            "Cancel": function () {
                $(this).dialog("close");
                $(".ui-dialog-content").dialog('destroy');
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectCustomColTitle() {
    var defer = $.Deferred();
    $("#add_custom_col_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 270,
        modal: true,
        buttons: {
            "Add this column title": function () {
                var customColTitle = $("#custom_col_title").val();
                if (customColTitle !== "") {                    
                    // nettoyage
                    // replace des espaces
                    customColTitle = customColTitle.replace(/\s+/g, ' ');
                    // replace des return
                    customColTitle = customColTitle.replace(/[\n\r]/g, '');
                    // trim
                    customColTitle = customColTitle.trim();
                    // 1ère lettre en capitale
                    customColTitle = customColTitle.charAt(0).toUpperCase() + customColTitle.slice(1);
                    // key
                    let customColTitleKey = customColTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, "_");
                    let customColTitleArray = [customColTitleKey, customColTitle];                
                    defer.resolve(customColTitleArray);
                }
                $(this).dialog("close");
                $(".ui-dialog-content").dialog('destroy');
            },
            "Cancel": function () {
                $(this).dialog("close");
                $(".ui-dialog-content").dialog('destroy');
            }
        },
        dialogClass: "custom-dialog"
    });
    return defer.promise();
}

function selectColTitle() {
    let defer = $.Deferred();
    $("#col_title_select_wrapper").dialog({
        autoOpen: true,
        height: 200,
        width: 270,
        modal: true,
        buttons: {
            "Select this column title": function () {
                let colTitleKey = $("#col_title_select").val();
                let colTitle = $("#col_title_select option:selected").text();
                let colTitleArray = [colTitleKey, colTitle];
                defer.resolve(colTitleArray);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
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
                console.log("dialog : levelUrl selected = " + levelUrl);
                defer.resolve(levelUrl);
                $(this).dialog("close");                             
            },
            "Cancel": function () {
                $(this).dialog("close");
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
            }
        },
        dialogClass: "custom-dialog"
    });
}

// Dialogue de sélection d'url pour level inférieur

//document.getElementById('select_deeper_links_form').onchange = function () {
//    var url = this.value;
//    chrome.tabs.query({
//        currentWindow: false,
//        active: true
//    }, function (tabs) {
//        chrome.tabs.update(tabs[0].id, {
//            url: url
//        });
//    });
//};

//// Dialogue de sélection d'url pour level inférieur - 2
//$(function () {
//    $("#select_deeper_links_wrapper").dialog({
//        autoOpen: false,
//        height: 400,
//        width: 350,
//        modal: true,
//        buttons: {
//            "Select this url": function () {
//                $(this).dialog("close");
//                var selectDeeperLinks = document.getElementById('select_deeper_links');
//                var otherUrls = [];
//                for (var i = 0; i < selectDeeperLinks.options.length; i++) {
//                    var val = selectDeeperLinks.options[i].value;
//                    if (val != "")
//                        otherUrls.push(val);
//                }
//                var levelUrl = selectDeeperLinks.options[selectDeeperLinks.selectedIndex].value;
//                if (levelUrl !== "") {
//                    var levelId = $(this).data("levelId");
//                    // on créé le nouveau level
//                    addLevel(levelId, levelUrl);
//                    var level = getLevel(levelId);
//                    level.otherUrls = otherUrls;
//                    // On affiche le nouveau level
//                    createLevelWrapper(level);
//                    displayLevel(level);
//                    // On désactive le bouton addLevel
//                    var addLevelButton = document.getElementById("add_level-" + levelId);
//                    addLevelButton.setAttribute("style", "opacity: 0.5");
//                    addLevelButton.disabled = true;
//                    // on ajoute le bouton de suppression de level
//                    var removeLevelButton = document.createElement("button");
//                    removeLevelButton.setAttribute("class", "button_select button_img");
//                    removeLevelButton.setAttribute("id", "remove_level-" + levelId);
//                    removeLevelButton.setAttribute("title", "Remove level " + levelId);
//                    removeLevelButton.addEventListener("click", function (event) {
//                        event.preventDefault();
//                        // on supprime le current level
//                        removeLevel(level);
//                        removeLevelWrapper(level);
//                        // et ceux d'en dessous
//                        var levelsToRemove = [];
//                        for (var i = 0; i < levels.length; i++) {
//                            var levelToRemove = levels[i];
//                            if (levelToRemove.id < level.id)
//                                levelsToRemove.push(levelToRemove);
//                        }
//                        if (levelsToRemove.length > 0) {
//                            for (var i = 0; i < levelsToRemove.length; i++) {
//                                var levelToRemove = levelsToRemove[i];
//                                removeLevel(levelToRemove);
//                                removeLevelWrapper(levelToRemove);
//                            }
//                        }
//
//                        // on enlève le bouton remove
//                        document.getElementById("remove_level-" + levelId).outerHTML = "";
//                        // on réactive le bouton addlevel
//                        if (document.getElementById("add_level-" + levelId) !== null) {
//                            var addLevelButton = document.getElementById("add_level-" + levelId);
//                            addLevelButton.setAttribute("style", "opacity: 1");
//                            addLevelButton.disabled = false;
//                        }
//                    });
//                    // button img
//                    var bImg = document.createElement("img");
//                    bImg.setAttribute("src", "icons/remove_level-25.png");
//                    // Ajout img au button
//                    removeLevelButton.appendChild(bImg);
//                    // Ajout button au wrapper
//                    addLevelButtonWrapper = document.getElementById("add_level_button_wrapper_level-" + levelId);
//                    addLevelButtonWrapper.appendChild(removeLevelButton);
//                }
//            },
//            "Cancel": function () {
//                $(this).dialog("close");
//            }
//        }
//    });
//});