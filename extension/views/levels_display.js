function start() {
    // DEJSONIZE
    var dejsonizeButtonWrapper = document.createElement("div");
    dejsonizeButtonWrapper.setAttribute("id", "dejsonize_button_wrapper");
    dejsonizeButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // label
    var dejsonizeLabel = document.createElement("label");
    dejsonizeLabel.setAttribute("for", "dejsonize");
    dejsonizeLabel.setAttribute("class", "dejsonize_label");
    dejsonizeLabel.innerHTML = extensionLang.DejsonizeButton;
    // input
    var dejsonizeInput = document.createElement("input");
    dejsonizeInput.setAttribute("type", "file");
    dejsonizeInput.setAttribute("id", "dejsonize");
    dejsonizeInput.setAttribute("class", "dejsonize_input");
    dejsonizeInput.setAttribute("accept", "application/JSON");
    dejsonizeInput.addEventListener("change", readJsonFile);
    dejsonizeInput.onclick = function () {
        this.value = null;
    };
    
    // Ajout label au wrapper
    dejsonizeButtonWrapper.appendChild(dejsonizeLabel);
    // Ajout input au wrapper
    dejsonizeButtonWrapper.appendChild(dejsonizeInput);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(dejsonizeButtonWrapper);

    // NEW
    var newButtonWrapper = document.createElement("div");
    newButtonWrapper.setAttribute("id", "new_button_wrapper");
    newButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // button
    var newButton = document.createElement("button");
    newButton.setAttribute("class", "header_button");
    newButton.setAttribute("id", "new_button");
    newButton.addEventListener("click", function (event) {
        // on vide le form
        let levelTypeInput = document.getElementById("level_type");
        levelTypeInput.value = "";
        // on lance le dialogue
        selectLevelType()
            .then(function (levelTypeArray) {
                // on update le tab
                updateTab(browserTabId, browserTabUrl)
                    .then(function (response) {
                        if (response === 'complete') {
                            globalLevelId = 0;
                            globalRowId = 0;
                            globalColId = 0;
                            levels = [];
                            var tabs = document.getElementById("tabs");
                            tabs.style.display = "none";
                            // on vide le tabs
                            $('div#tabs ul li').remove();
                            $('div#tabs div').remove();
                            $("div#tabs").tabs("refresh");
                            let levelTypeKey = levelTypeArray[0];
                            let levelType = levelTypeArray[1];
                            // add key / type to level types
                            fillLevelTypes(levelTypeKey, levelType);
                            // new level
                            var level = addLevel(globalLevelId, levelTypeArray, browserTabUrl, browserTabId);
                            displayLevel(level);
                            // on enlève l'affichage du fichier json
                            removeDisplayedJsonFile();
                        }
                    })
            });
        event.preventDefault();
    });
    newButton.innerHTML = extensionLang.NewButton;
    // Ajout button au wrapper
    newButtonWrapper.appendChild(newButton);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(newButtonWrapper);
    
    // Boutons jsonize & dejsonize

    // JSONIZE
    var jsonizeButtonWrapper = document.createElement("div");
    jsonizeButtonWrapper.setAttribute("id", "jsonize_button_wrapper");
    jsonizeButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // button
    var jsonizeButton = document.createElement("button");
    jsonizeButton.setAttribute("class", "header_button");
    jsonizeButton.setAttribute("id", "jsonize");
    jsonizeButton.addEventListener("click", function (event) {
        jsonize();
        event.preventDefault();
    });
    jsonizeButton.innerHTML = extensionLang.JsonizeButton;
    // Ajout button au wrapper
    jsonizeButtonWrapper.appendChild(jsonizeButton);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(jsonizeButtonWrapper);

    // SCRAP
    var scrapButtonWrapper = document.createElement("div");
    scrapButtonWrapper.setAttribute("id", "scrap_button_wrapper");
    scrapButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // button
    var scrapButton = document.createElement("button");
    scrapButton.setAttribute("class", "header_button");
    scrapButton.setAttribute("id", "scrap");
    scrapButton.addEventListener("click", function (event) {
        initScrapping();
        scrappedObjects = [];
        console.log("levels_display : scrappedObjects length = " + scrappedObjects.length);
        let scrapTabId, $scrappingResultsWrapper;
        createNewTab("about:blank")
            .then(function (newTabId) {
                scrapTabId = newTabId;
                // ouverture du dialog
                $scrappingResultsWrapper = $("#scrapping_results_wrapper");
                $scrappingResultsWrapper.show();
                scrappingResults(scrapTabId);

                console.log("SCRAP LEVELS : ");    
                return scrapLevels(scrapTabId);
            })
            .then (function () {
            console.log("scrappedObjects lenght = " + scrappedObjects.length);
//                closeScrappingResultsDialog($scrappingResultsWrapper);
//                endScrap(scrapTabId);            
            });
        event.preventDefault();
    });
    scrapButton.innerHTML = extensionLang.ScrapButton;
    // Ajout button au wrapper
    scrapButtonWrapper.appendChild(scrapButton);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(scrapButtonWrapper);
    
    // wrapper dejsonized file name
    var dejsonizedFileWrapper = document.createElement("div");
    dejsonizedFileWrapper.setAttribute("id", "dejsonized_file_wrapper");
    // ajout
    document.getElementById("header_button_wrapper").appendChild(dejsonizedFileWrapper);

    // on montre le formulaire
    var levelTypeSelectWrapper = document.getElementById("level_type_select_wrapper");
    levelTypeSelectWrapper.style.display = "block";

    // on lance le dialogue
    selectLevelType()
        .then(function (levelTypeArray) {
            console.log("levelTypeArray : " + levelTypeArray);
            // on update le tab
            updateTab(browserTabId, browserTabUrl)
                .then(function (response) {
                    let levelTypeKey = levelTypeArray[0];
                    let levelType = levelTypeArray[1];
                    // add key / type to level types
                    fillLevelTypes(levelTypeKey, levelType);
                    if (response === 'complete') {
                        var level = addLevel(globalLevelId, levelTypeArray, browserTabUrl, browserTabId);
                        displayLevel(level);
                    }
                })
        });

    // par défaut, on désactive jsonize et scrap
    disableJsonizeButton();
    disableScrapButton();
}

function disableJsonizeButton() {
    var jsonizeButton = document.getElementById("jsonize");
    jsonizeButton.disabled = true;
}

function enableJsonizeButton() {
    var jsonizeButton = document.getElementById("jsonize");
    jsonizeButton.disabled = false;
}

function disableDejsonizeButton() {
    var dejsonizeButton = document.getElementById("dejsonize");
    dejsonizeButton.disabled = true;
}

function enableDejsonizeButton() {
    var dejsonizeButton = document.getElementById("dejsonize");
    dejsonizeButton.disabled = false;
}

function enableScrapButton() {
    var scrapButton = document.getElementById("scrap");
    scrapButton.disabled = false;
}

function disableScrapButton() {
    var scrapButton = document.getElementById("scrap");
    scrapButton.disabled = true;
}

function updateScrappingResultsDialog(objectType) {
    let $nbr_of_scrapped_objects = $("#nbr_of_scrapped_objects");
    let child = $(nbr_of_scrapped_objects).find("#nbr_of_" + objectType);
    if (child.length === 0)
        $nbr_of_scrapped_objects.append("<p id='nbr_of_" + objectType + "'>" + objectsCount.get(objectType) + " " + objectType + "(s)</p>");
    else
        child.text(objectsCount.get(objectType) + " " + objectType + "(s)");
}

function initScrappingResultsDialog() {
    var nbr_of_scrapped_objects = document.getElementById("nbr_of_scrapped_objects");
    nbr_of_scrapped_objects.innerHTML = "";
    var scrapping_done = document.getElementById("scrapping_done");
    scrapping_done.innerHTML = ""
}

function closeScrappingResultsDialog($scrappingResultsWrapper) {
    $scrappingResultsWrapper.dialog('close');
    $("#scrapping_results_wrapper").dialog("destroy");
    $("#scrapping_results_wrapper").css("display", "none");
}

// function update levels
// => jsonize button
// => dejsonize button
// => scrap button
function updateLevelsDisplay() {
    // JSONize et Scrap : si au moins 1 depth et 1 col
    if (getLevelsColsNbr() > 0) {
        enableJsonizeButton();
        enableScrapButton();
    } else {
        disableJsonizeButton();
        disableScrapButton();
    }
    // fermeture du dialog de sélection
    if ($("#select_content_dialog_wrapper").closest('.ui-dialog').is(':visible'))
        $("#select_content_dialog_wrapper").dialog("close");
}
