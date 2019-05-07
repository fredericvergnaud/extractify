function displayLevel(level) {
    
    var text;
    
    // jquery-ui tab li
    var levelTab = document.createElement("li");
    levelTab.setAttribute("id", "level_tab_level-" + level.id);
    levelTab.setAttribute("role", "tab");
    levelTab.setAttribute("class", "");
    
    // jquery-ui tab a
    var levelTabLink = document.createElement("a");
    levelTabLink.setAttribute("href", "#tabs-" + level.id);
    
    // jquery-ui tab a text
    var levelTabLinkTxt = "";
    if (level.id === 0)
        levelTabLinkTxt = "LEVEL " + level.id
    else
        levelTabLinkTxt = "LEVEL -" + level.id
    levelTabLink.innerHTML = levelTabLinkTxt;
    levelTab.appendChild(levelTabLink);
    
    // jquery-ui tab reference
    var levelTabWrapper = document.createElement("div");    
    levelTabWrapper.setAttribute("id", "tabs-" + level.id);
    levelTabWrapper.setAttribute("class", "level_panel");
    
    // type
    var typeWrapper = document.createElement("div");
    typeWrapper.setAttribute("class", "level_type_wrapper");
    typeWrapper.setAttribute("id", "level_type_wrapper_level-" + level.id);
    text = document.createTextNode("Type : " + levelTypes[level.type]);
    typeWrapper.appendChild(text);
    
    // remove level button wrapper
    var removeLevelButtonWrapper = document.createElement("div");
    removeLevelButtonWrapper.setAttribute("id", "remove_level_button_wrapper_level-" + level.id);
    removeLevelButtonWrapper.setAttribute("class", "remove_level_button_wrapper");

    // remove level button
    var removeLevelButton = document.createElement("button");
    removeLevelButton.setAttribute("class", "button_select button_img remove_level_button");
    removeLevelButton.setAttribute("id", "remove_level-" + level.id);
    removeLevelButton.setAttribute("title", "Remove level " + level.id);
    removeLevelButton.innerHTML = "Remove";
    removeLevelButton.addEventListener("click", function (event) {
        console.log("click sur remove level");
        removeLevel(level.id);
        event.preventDefault();
    });

    // ajout de removeLevelButton à removeLevelButtonWrapper si != de level 0
    if (level.id !== 0)
        removeLevelButtonWrapper.appendChild(removeLevelButton);

    // level url wrapper
    var levelUrlWrapper = document.createElement("div");
    levelUrlWrapper.setAttribute("class", "level_url_wrapper");
    levelUrlWrapper.setAttribute("id", "level_url_wrapper_level-" + level.id);
    text = document.createTextNode("Url : " + level.url);
    levelUrlWrapper.appendChild(text);

    // Détails
    var levelDetailsWrapper = document.createElement("div");
    levelDetailsWrapper.setAttribute("class", "level_details");
    levelDetailsWrapper.setAttribute("id", "level_details_wrapper_level-" + level.id);
    levelDetailsWrapper.innerHTML = 'Details : ' + getRowsNbr(level) + ' row(s) | ' + getColsNbr(level) + ' colum(s) | ' + getPaginationNbr(level) + ' pagination';
    
    // level buttons wrapper
    var levelButtonsWrapper = document.createElement("div");
    levelButtonsWrapper.setAttribute("class", "level_buttons_wrapper");
    levelButtonsWrapper.setAttribute("id", "level_buttons_wrapper_level-" + level.id);
    
    // add level button
    var addLevelButtonWrapper = document.createElement("div");
    addLevelButtonWrapper.setAttribute("id", "add_level_button_wrapper_level-" + level.id);
    addLevelButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // button
    var addLevelButton = document.createElement("button");
    addLevelButton.setAttribute("class", "button_select button_img");
    addLevelButton.setAttribute("id", "add_level_level-" + level.id);
    addLevelButton.addEventListener("click", function (event) {
        // on remplit le formulaire de sélection des liens
        var selectDeeperLinksForm = document.getElementById("select_deeper_links_form");
        selectDeeperLinksForm.innerHTML = "";

        // on trie levels selon id
        console.log("levels avant tri : ");
        console.log(levels);
        levels.sort(compareLevelId);
        console.log("levels après tri : ");
        console.log(levels);
        var lastLevel = levels[levels.length - 1];

        console.log("someDeeperLinks = " + level.someDeeperLinks.length);

        // on rempli le select avec les liens
        for (let deeperLink of level.someDeeperLinks) {
            var option = document.createElement("option");
            option.text = deeperLink;
            selectDeeperLinksForm.add(option);
        }
        // on remplit le formulaire de sélection du type selon les types déjà utilisés        

        // on efface d'abord toutes les options
        $("#level_type_select").find('option').remove().end();
        let levelTypeSelect = document.getElementById("level_type_select");
        
        let newLevelTypes = getRemainingLevelTypes();        

        if (Object.keys(newLevelTypes).length > 0) {
            for (let key in newLevelTypes) {
                let option = document.createElement("option");
                option.setAttribute("value", key);
                option.text = newLevelTypes[key];
                if (lastLevel.type === "topic") {
                    if (newLevelTypes[key] != "forum")                     
                        levelTypeSelect.add(option);
                } else
                  levelTypeSelect.add(option);  
            }

            // on montre le dialog
            selectDeeperLinksForm.style.display = 'block';
            var newLevelUrl = "";
            selectDeeperLink()
                .then(function (levelUrlChoosen) {
                    console.log("new level url choosen = " + levelUrlChoosen);
                    newLevelUrl = levelUrlChoosen;
                    // on montre le formulaire
                    levelTypeSelect.style.display = "block";
                    selectLevelType()
                        .then(function (type) {
                            // on crée un nouveau tab
                            createNewTab(newLevelUrl)
                                .then(function (newTabId) {
                                    var newLevel = addLevel(globalLevelId, type, newLevelUrl, newTabId);
                                    displayLevel(newLevel);
                                    updateLevelDisplay(level);
                                });
                        });
                });                    
        }
        event.preventDefault();
    });
    addLevelButton.innerHTML = "Add level";
    // Ajout button au wrapper
    addLevelButtonWrapper.appendChild(addLevelButton);

    // add row button wrapper
    var addRowButtonWrapper = document.createElement("div");
    addRowButtonWrapper.setAttribute("id", "add_row_button_wrapper_level-" + level.id);

    // select row button
    var addRowButton = document.createElement("button");
    addRowButton.setAttribute("class", "button_select button_img");
    addRowButton.setAttribute("id", "add_row_level-" + level.id);
    addRowButton.setAttribute("title", "Add a row for level " + level.id);
    addRowButton.innerHTML = "Add row";
    addRowButton.addEventListener("click", function (event) {
        console.log("click selectRowButtonWrapper : globalRowId = " + globalRowId);
        var dataArray = {"rows" : level.rows, "rowId" : globalRowId};
        sendMessageToTab(level.tabId, "selectRows", dataArray)
            .then(function (selectedRows) {
                console.log("selectedRows.rowTagClass : " + selectedRows.rowTagClass + " | selectedRows.rowColor : " + selectedRows.rowColor);                
                var row = addRow(selectedRows.rowTagClass, selectedRows.rowColor, globalRowId, level);
                displayRow(row, level);
                updateLevelDisplay(level);
                updateLevelsDisplay();                
            });
        event.preventDefault();
    });

    addRowButtonWrapper.appendChild(addRowButton);

    // add pagination button wrapper
    var addPaginationButtonWrapper = document.createElement("div");
    addPaginationButtonWrapper.setAttribute("id", "add_pagination_button_wrapper_level-" + level.id);
    
    // select pagination button
    var addPaginationButton = document.createElement('button');
    addPaginationButton.setAttribute('class', "button_select");
    addPaginationButton.setAttribute('id', "add_pagination_button_level-" + level.id);
    addPaginationButton.setAttribute('title', "Select pagination for level " + level.id);
    addPaginationButton.innerHTML = "Add pagination";
    addPaginationButton.addEventListener("click", function (event) {
        var dataArray = [];
        sendMessageToTab(level.tabId, "selectPagination", dataArray)
            .then(function (selectedPagination) {
                console.log("selectedPagination : " + selectedPagination.paginationTagClass);               
                var pagination = addPagination(selectedPagination.paginationTagClass, level);
                displayPagination(level);
                updateLevelDisplay(level);
                updateLevelsDisplay();                
            });
        event.preventDefault();
    });
    addPaginationButtonWrapper.appendChild(addPaginationButton);

    // Ajouts des boutons au wrapper de boutons
    levelButtonsWrapper.appendChild(addLevelButtonWrapper);
    levelButtonsWrapper.appendChild(addRowButtonWrapper);
    levelButtonsWrapper.appendChild(addPaginationButtonWrapper);
    
    // Wrapper du tableau de sélection
    var selectionTableWrapper = document.createElement("div");
    selectionTableWrapper.setAttribute("id", "selection_table_wrapper_level-" + level.id);

    // Ajouts
    // Container
    var levelWrapper = document.createElement("div");
    levelWrapper.setAttribute("class", "level_wrapper");
    levelWrapper.setAttribute("id", "level_wrapper_level-" + level.id);

    levelWrapper.appendChild(typeWrapper);
    if (level.id > 0)
        levelWrapper.appendChild(removeLevelButtonWrapper);
    levelWrapper.appendChild(levelUrlWrapper);
    levelWrapper.appendChild(levelDetailsWrapper);
    levelWrapper.appendChild(levelButtonsWrapper);
    levelWrapper.appendChild(selectionTableWrapper);
    
    // Ajout du container au tab
    levelTabWrapper.appendChild(levelWrapper);
    
    // Ajout du tab aux tabs
    $("div#tabs ul").append(levelTab);
    $("div#tabs").append(levelTabWrapper);

    // on montre jquery ui tabs
    var tabs = document.getElementById("tabs");
    $("#tabs").tabs("refresh");
    $("#tabs").tabs("option", "active", level.id);
    tabs.style.display = "block";
    
    // par défaut : on désactive le pagination button et le add level button
    disableAddPaginationButton(level);
    disableAddLevelButton(level);
    
}

function disableAddLevelButton(level) {
    var addLevelButton = document.getElementById("add_level_level-" + level.id);
    addLevelButton.disabled = true;
}

function enableAddLevelButton(level) {
    var addLevelButton = document.getElementById("add_level_level-" + level.id);
    addLevelButton.disabled = false;
}

function enableAddPaginationButton(level) {
    var addPaginationButton = document.getElementById("add_pagination_button_level-" + level.id);
    addPaginationButton.disabled = false;
}

function disableAddPaginationButton(level) {
    // Neutralisation du bouton ajout de pagination
    var addPaginationButton = document.getElementById("add_pagination_button_level-" + level.id);
    addPaginationButton.disabled = true;
}

// function d'update du level display 
// => bouton add level
// => bouton enable / disable add pagination 
// => level details
function updateLevelDisplay(level) {
    // Add level : si au moins 1 depth et 1 col et pas de level supérieur
    const upperLevel = levels[level.id + 1];
    console.log("updateLevelDisplay : level.pagination = " + level.pagination + " | colsNbr = " + getColsNbr(level) + " | depthNbr = " + getDepthNbr(level) + " | upperLevel = " + upperLevel);
    
    if (getDepthNbr(level) > 0 && getColsNbr(level) > 0 && upperLevel === undefined)
        enableAddLevelButton(level);
    else
        disableAddLevelButton(level);
    
    // Add pagination button : si au moins 1 col
    if (getColsNbr(level) > 0) {
        if (level.pagination === null)
            enableAddPaginationButton(level);
        else
            disableAddPaginationButton(level);    
    } else {
        removePaginationDisplay(level);
        disableAddPaginationButton(level);
    }
    
    // Details
    var levelDetailsWrapper = document.getElementById("level_details_wrapper_level-" + level.id);
    levelDetailsWrapper.innerHTML = 'Details : ' + getRowsNbr(level) + ' row(s) | ' + getColsNbr(level) + ' colum(s) | ' + getPaginationNbr(level) + ' pagination';
}

function removeLevelsTabs(levelsToRemove) {
    for (var i = 0; i < levelsToRemove.length; i++) {
        var levelToRemove = levelsToRemove[i];
        var levelToRemoveId = levelToRemove.id;
        console.log("on essaye d'enlever level id " + levelToRemoveId);
        var panelId = $("#level_tab_level-" + levelToRemoveId).remove().attr( "aria-controls" );
        console.log("removeLevelsTabs : panelId = " + panelId);
        $( "#" + panelId ).remove();
        $("#tabs").tabs( "refresh" ); 
    }
}