function start() {
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
    jsonizeButton.innerHTML = "JSONize";
    // Ajout button au wrapper
    jsonizeButtonWrapper.appendChild(jsonizeButton);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(jsonizeButtonWrapper);

    // DEJSONIZE
    var dejsonizeButtonWrapper = document.createElement("div");
    dejsonizeButtonWrapper.setAttribute("id", "dejsonize_button_wrapper");
    dejsonizeButtonWrapper.setAttribute("class", "level_buttons_wrapper");
    // label
    var dejsonizeLabel = document.createElement("label");
    dejsonizeLabel.setAttribute("for", "dejsonize");
    dejsonizeLabel.setAttribute("class", "dejsonize_label");
    dejsonizeLabel.innerHTML = 'deJSONize';
    // input
    var dejsonizeInput = document.createElement("input");
    dejsonizeInput.setAttribute("type", "file");
    dejsonizeInput.setAttribute("id", "dejsonize");
    dejsonizeInput.setAttribute("class", "dejsonize_input");
    dejsonizeInput.setAttribute("accept", "application/JSON");
    dejsonizeInput.addEventListener("change", readJsonFile, false);
    // Ajout label au wrapper
    dejsonizeButtonWrapper.appendChild(dejsonizeLabel);
    // Ajout input au wrapper
    dejsonizeButtonWrapper.appendChild(dejsonizeInput);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(dejsonizeButtonWrapper);

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
        let scrapTabId, $scrappingResultsWrapper;
        createNewTab("about:blank")
            .then(function (newTabId) {
                console.log("response : newTabId  = " + newTabId);
                scrapTabId = newTabId;
                // ouverture du dialog
                $scrappingResultsWrapper = $("#scrapping_results_wrapper");
                $scrappingResultsWrapper.show();
                scrappingResults(newTabId);
                return scrapLevels(newTabId, levels);
            })
            .then(function () {
                if (forums.size > 0 || topics.size > 0 || messages.length > 0) {
                    successScrappingResultsDialog();                    
                } else {
                    failedScrappingResultsDialog();
                }
                closeScrappingResultsDialog($scrappingResultsWrapper);
                console.log("Après scrap , resultats : ");
                displayScrappingResults();                    
                endScrap(scrapTabId);
            });
        event.preventDefault();
    });
    scrapButton.innerHTML = "Scrap";
    // Ajout button au wrapper
    scrapButtonWrapper.appendChild(scrapButton);
    // Ajout wrapper sous le titre principal "EXTRACTIFY"
    document.getElementById("header_button_wrapper").appendChild(scrapButtonWrapper);

    // level type select

    var levelTypeSelect = document.getElementById("level_type_select");
    for (var key in levelTypes) {
        option = document.createElement("option");
        option.setAttribute("value", key);
        option.text = levelTypes[key];
        levelTypeSelect.add(option);
    }

    // on montre le formulaire
    levelTypeSelect.style.display = "block";

    // on lance le dialogue
    selectLevelType()
        .then(function (levelType) {
            // on update le tab
            updateTab(originalTabId, originalTabUrl)
                .then(function (response) {
                    console.log("originalTab update : " + response);
                    if (response === 'complete') {
                        var level = addLevel(globalLevelId, levelType, originalTabUrl, originalTabId);
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

function updateScrappingResultsDialog(nbr, levelType) {
    var nbr_of_scrapped_levelType = document.getElementById("nbr_of_scrapped_" + levelType);
    nbr_of_scrapped_levelType.innerHTML = nbr + " " + levelType + " scrapped";
}

function initScrappingResultsDialog() {
    var nbr_of_scrapped_forum = document.getElementById("nbr_of_scrapped_forum");
    nbr_of_scrapped_forum.innerHTML = "";
    var nbr_of_scrapped_topic = document.getElementById("nbr_of_scrapped_topic");
    nbr_of_scrapped_topic.innerHTML = "";
    var nbr_of_scrapped_message = document.getElementById("nbr_of_scrapped_message");
    nbr_of_scrapped_message.innerHTML = "";
    var scrapping_done = document.getElementById("scrapping_done");
    scrapping_done.innerHTML = ""
}

function successScrappingResultsDialog() {
    var scrapping_done = document.getElementById("scrapping_done");
    scrapping_done.innerHTML = "Success !"
}

function failedScrappingResultsDialog() {
    var scrapping_done = document.getElementById("scrapping_done");
    scrapping_done.innerHTML = "Failed !"
}

function closeScrappingResultsDialog($scrappingResultsWrapper) {
    $scrappingResultsWrapper.dialog('close');
}

// function update levels
// => jsonize button
// => dejsonize button
// => scrap button
function updateLevelsDisplay() {
    // JSONize : si au moins 1 depth et 1 col
    if (getLevelsColsNbr() > 0) {
        enableJsonizeButton();
        enableScrapButton();
    } else {
        disableJsonizeButton();
        disableScrapButton();
    }
}
