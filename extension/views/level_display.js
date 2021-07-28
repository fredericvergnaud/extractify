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
  text = document.createTextNode("Type : " + levelTypes[level.typeKey]);
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
  removeLevelButton.innerHTML = extensionLang.RemoveButton;
  removeLevelButton.addEventListener("click", function(event) {
    removeLevel(level.id);
    event.preventDefault();
  });
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
  addLevelButton.addEventListener("click", function(event) {
    // on remplit le formulaire de sélection des liens
    var selectDeeperLinksForm = document.getElementById("select_deeper_links_form");
    selectDeeperLinksForm.innerHTML = "";

    // on trie levels selon id
    levels.sort(compareLevelId);
    var lastLevel = levels[levels.length - 1];

    // on rempli le select avec les liens
    for (let deeperLink of level.someDeeperLinks) {
      var option = document.createElement("option");
      option.text = deeperLink;
      selectDeeperLinksForm.add(option);
    }

    // on montre le dialog
    selectDeeperLinksForm.style.display = 'block';
    let newLevelUrl, newLevelTypeArray;
    selectDeeperLink()
      .then(function(levelUrlChoosen) {
        //                    console.log("new level url choosen = " + levelUrlChoosen);
        newLevelUrl = levelUrlChoosen;
        // on montre le formulaire
        let levelTypeSelectWrapper = document.getElementById("level_type_select_wrapper");
        levelTypeSelectWrapper.style.display = "block";
        // on vide le form
        let levelTypeInput = document.getElementById("level_type");
        levelTypeInput.value = "";
        selectLevelType()
          .then(function(levelTypeArray) {
            console.log(levelTypeArray);
            newLevelTypeArray = levelTypeArray;
            // on crée un nouveau tab
            createNewTab(newLevelUrl)
              .then(function(newTabId) {
                let newLevelTypeKey = newLevelTypeArray[0];
                let newLevelType = newLevelTypeArray[1];
                // add key / type to level types
                fillLevelTypes(newLevelTypeKey, newLevelType);
                var newLevel = addLevel(globalLevelId, newLevelTypeArray, newLevelUrl, newTabId);
                displayLevel(newLevel);
                updateLevelDisplay(level);
              });
          });
      });
    //        }
    event.preventDefault();
  });
  addLevelButton.innerHTML = extensionLang.AddLevelButton;
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
  addRowButton.innerHTML = extensionLang.AddRowButton;
  addRowButton.addEventListener("click", function(event) {

    // on efface l'input de tag & class
    let rowSelectorInput = document.getElementById("row_tag_class");
    rowSelectorInput.value = "";

    // on montre le formulaire
    let addRowWrapper = document.getElementById("add_row_wrapper");
    addRowWrapper.style.display = "block";

    selectRow()
      .then(function(rowSelector) {
        console.log("rowSelector choosen = " + rowSelector);
        if (rowSelector !== "") {
          // add row
          highlightRows(level.tabId, level, rowSelector, globalRowId)
            .then(function(selectedRows) {
              var row = addRow(selectedRows.rowSelector, selectedRows.rowColor, globalRowId, level);
              displayRow(row, level);
              updateLevelDisplay(level);
              updateLevelsDisplay();
            });
        } else {
          var dataArray = {
            "rows": level.rows,
            "rowId": globalRowId
          };
          sendMessageToTab(level, "selectRows", dataArray)
            .then(function(selectedRows) {
              var row = addRow(selectedRows.rowSelector, selectedRows.rowColor, globalRowId, level);
              displayRow(row, level);
              updateLevelDisplay(level);
              updateLevelsDisplay();
            });
        }
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
  addPaginationButton.innerHTML = extensionLang.AddPaginationButton;
  addPaginationButton.addEventListener("click", function(event) {

    // on efface l'input de tag & class
    let paginationSelectorInput = document.getElementById("pagination_tag_class");
    paginationSelectorInput.value = "";

    // on montre le formulaire
    let addPaginationWrapper = document.getElementById("add_pagination_wrapper");
    addPaginationWrapper.style.display = "block";

    selectPagination()
      .then(function(paginationSelector) {
        console.log("paginationSelector choosen = " + paginationSelector);
        if (paginationSelector !== "") {
          // add pagination
          highlightPagination(level.tabId, level, paginationSelector)
            .then(function(selectedPagination) {
              let pagination = addPagination(selectedPagination.paginationSelector, selectedPagination.paginationPrefix, selectedPagination.paginationStep, level);
              displayPagination(level);
              updateLevelDisplay(level);
              updateLevelsDisplay();
            });
        } else {
          var dataArray = [];
          sendMessageToTab(level, "selectPagination", dataArray)
            .then(function(selectedPagination) {
              let pagination = addPagination(selectedPagination.paginationSelector, selectedPagination.paginationPrefix, selectedPagination.paginationStep, level);
              displayPagination(level);
              updateLevelDisplay(level);
              updateLevelsDisplay();
            });
        }
      });
    event.preventDefault();
  });
  addPaginationButtonWrapper.appendChild(addPaginationButton);

  // add custom pagination button wrapper
  var addCustomPaginationButtonWrapper = document.createElement("div");
  addCustomPaginationButtonWrapper.setAttribute("id", "add_custom_pagination_button_wrapper_level-" + level.id);

  // select custom pagination button
  var addCustomPaginationButton = document.createElement('button');
  addCustomPaginationButton.setAttribute('class', "button_select");
  addCustomPaginationButton.setAttribute('id', "add_custom_pagination_button_level-" + level.id);
  addCustomPaginationButton.setAttribute('title', "Select custom pagination for level " + level.id);
  addCustomPaginationButton.innerHTML = extensionLang.AddCustomPaginationButton;
  addCustomPaginationButton.addEventListener("click", function(event) {

    // on efface les input
    let paginationPrefixInput = document.getElementById("pagination_prefix");
    paginationPrefixInput.value = "";
    let paginationStepInput = document.getElementById("pagination_step");
    paginationStepInput.value = "";

    // on montre le formulaire
    let addCustomPaginationWrapper = document.getElementById("add_custom_pagination_wrapper");
    addCustomPaginationWrapper.style.display = "block";

    selectCustomPagination()
      .then(function(dataArray) {
        console.log("dataArray = " + dataArray);
        matchPaginationPrefixAndStep(level.tabId, dataArray[0], dataArray[1])
          .then(function(isMatchedPrefixAndStep) {
            console.log("isMatchedPrefixAndStep ? " + isMatchedPrefixAndStep);
            if (isMatchedPrefixAndStep) {
              var pagination = addPagination("custom pagination", dataArray[0], dataArray[1], level);
              displayPagination(level);
              updateLevelDisplay(level);
              updateLevelsDisplay();
            }
          });
      });
    event.preventDefault();
  });
  addCustomPaginationButtonWrapper.appendChild(addCustomPaginationButton);

  // Ajouts des boutons au wrapper de boutons
  levelButtonsWrapper.appendChild(addLevelButtonWrapper);
  levelButtonsWrapper.appendChild(addRowButtonWrapper);
  levelButtonsWrapper.appendChild(addPaginationButtonWrapper);
  levelButtonsWrapper.appendChild(addCustomPaginationButtonWrapper);

  // Wrapper du tableau de sélection
  var selectionTableWrapper = document.createElement("div");
  selectionTableWrapper.setAttribute("id", "selection_table_wrapper_level-" + level.id);

  // Ajouts
  // Container
  var levelWrapper = document.createElement("div");
  levelWrapper.setAttribute("class", "level_wrapper");
  levelWrapper.setAttribute("id", "level_wrapper_level-" + level.id);

  levelWrapper.appendChild(typeWrapper);
  levelWrapper.appendChild(levelUrlWrapper);
  levelWrapper.appendChild(levelDetailsWrapper);
  if (level.id > 0)
    levelWrapper.appendChild(removeLevelButtonWrapper);
  levelWrapper.appendChild(levelButtonsWrapper);
  levelWrapper.appendChild(selectionTableWrapper);

  // Ajout du container au tab
  levelTabWrapper.appendChild(levelWrapper);

  // Ajout du tab aux tabs
  $("div#tabs ul").append(levelTab);
  $("div#tabs").append(levelTabWrapper);

  // on montre jquery ui tabs
  $("#tabs").tabs("refresh");
  $("#tabs").tabs("option", "active", level.id);
  var tabs = document.getElementById("tabs");
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

function enableAddCustomPaginationButton(level) {
  var addCustomPaginationButton = document.getElementById("add_custom_pagination_button_level-" + level.id);
  addCustomPaginationButton.disabled = false;
}

function disableAddCustomPaginationButton(level) {
  // Neutralisation du bouton ajout de pagination
  var addCustomPaginationButton = document.getElementById("add_custom_pagination_button_level-" + level.id);
  addCustomPaginationButton.disabled = true;
}

// function d'update du level display
// => bouton add level
// => bouton enable / disable add pagination
// => level details
function updateLevelDisplay(level) {
  // Add level : si au moins 1 depth et 1 col et pas de level supérieur
  const upperLevel = levels[level.id + 1];
  if (getDepthNbr(level) > 0 && getColsNbr(level) > 0 && upperLevel === undefined)
    enableAddLevelButton(level);
  else
    disableAddLevelButton(level);

  // Add pagination button et custom pagination : si au moins 1 col
  if (getColsNbr(level) > 0) {
    if (level.pagination === null) {
      enableAddPaginationButton(level);
      enableAddCustomPaginationButton(level);
    } else {
      disableAddPaginationButton(level);
      disableAddCustomPaginationButton(level);
    }
  } else {
    removePaginationDisplay(level);
    disableAddPaginationButton(level);
    disableAddCustomPaginationButton(level);
  }

  // Details
  var levelDetailsWrapper = document.getElementById("level_details_wrapper_level-" + level.id);
  levelDetailsWrapper.innerHTML = 'Details : ' + getRowsNbr(level) + ' row(s) | ' + getColsNbr(level) + ' colum(s) | ' + getPaginationNbr(level) + ' pagination';
}

function removeLevelsTabs(levelsToRemove) {
  for (var i = 0; i < levelsToRemove.length; i++) {
    var levelToRemove = levelsToRemove[i];
    var levelToRemoveId = levelToRemove.id;
    var panelId = $("#level_tab_level-" + levelToRemoveId).remove().attr("aria-controls");
    if (panelId)
      $("#" + panelId).remove();
    $("#tabs").tabs("refresh");
  }
}
