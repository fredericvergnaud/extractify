function displayRow(row, level) {
    var text;

    // left wrapper
    var rowLeftWrapper = document.createElement('div');
    rowLeftWrapper.setAttribute('class', "row_left_wrapper");

    // Type
    var dataTypeWrapper = document.createElement('div');
    dataTypeWrapper.setAttribute('class', "rows_table_cell rows_table_cell_small");
    dataTypeWrapper.setAttribute('id', "data_type_wrapper_row-" + row.id);
    dataTypeWrapper.innerHTML = row.dataType;

    // Couleur
    var colorWrapper = document.createElement('div');
    colorWrapper.setAttribute('class', "rows_table_cell rows_table_cell_small");
    colorWrapper.setAttribute('id', "color_wrapper_row-" + row.id);
    colorWrapper.innerHTML = '<div class="row-color highlight_row-' + row.id + '" style="background-color:' + row.color + '">&nbsp;</div>';

    // Selector
    var classNameWrapper = document.createElement('div');
    classNameWrapper.setAttribute('class', "rows_table_cell rows_table_cell_big");
    classNameWrapper.setAttribute('id', "class_name_wrapper_row-" + row.id);
    classNameWrapper.innerHTML = row.selector;

    // Ajout
    rowLeftWrapper.appendChild(dataTypeWrapper);
    rowLeftWrapper.appendChild(colorWrapper);
    rowLeftWrapper.appendChild(classNameWrapper);

    // right wrapper
    var rowRightWrapper = document.createElement('div');
    rowRightWrapper.setAttribute('class', "row_right_wrapper");

    // remove row button wrapper
    var removeRowButtonWrapper = document.createElement('div');
    removeRowButtonWrapper.setAttribute('class', "rows_table_cell rows_table_cell_button");
    // remove row button
    var removeRowButton = document.createElement('button');
    removeRowButton.setAttribute('id', "remove_row-" + row.id);
    removeRowButton.setAttribute('class', "button_remove_row");
    removeRowButton.setAttribute('title', "Remove row " + row.id);
    removeRowButton.innerHTML = extensionLang.RemoveButton;
    removeRowButton.addEventListener("click", function (event) {
        // on supprime le row
        removeRow(row, level);
        // on supprime le display
        removeRowDisplay(row);
        // on update le level
        updateLevelDisplay(level);
        // et levels
        updateLevelsDisplay();
        event.preventDefault();
    });
    // Ajout bouton au wrapper
    removeRowButtonWrapper.appendChild(removeRowButton);

    // add depth button wrapper
    var addDepthButtonWrapper = document.createElement('div');
    addDepthButtonWrapper.setAttribute('class', "rows_table_cell rows_table_cell_button");
    // add depth button
    var addDepthButton = document.createElement('button');
    addDepthButton.setAttribute('id', "add_depth_button_row-" + row.id);
    addDepthButton.setAttribute('class', "button_add_depth");
    addDepthButton.setAttribute('title', "Add deeper links for row " + row.id);
    addDepthButton.innerHTML = extensionLang.AddDepthButton;
    addDepthButton.addEventListener("click", function (event) {

        // on efface l'input de tag & class
        let depthSelectorInput = document.getElementById("depth_tag_class");
        depthSelectorInput.value = "";

        // on montre le formulaire
        let addDepthWrapper = document.getElementById("add_depth_wrapper");
        addDepthWrapper.style.display = "block";

        selectDepth()
            .then(function (depthSelector) {
                console.log("depthSelector choosen = " + depthSelector);
                if (depthSelector !== "") {
                    highlightDepth(level.tabId, row, depthSelector)
                        .then(function(selectedDepth) {
                            let depth = addDepth(selectedDepth.depthSelector, row);
                            level.someDeeperLinks.push(...selectedDepth.deeperLinks);
                            displayDepth(depth, row, level);
                            updateRowDisplay(row, level);
                            updateLevelDisplay(level);
                            updateLevelsDisplay();
                        });

                } else {
                    let depthData = {
                        "row": row
                    };
                    sendMessageToTab(level, "selectDepth", depthData)
                        .then(function (selectedDepth) {
                            level.someDeeperLinks.push(...selectedDepth.deeperLinks);
                            var depth = addDepth(selectedDepth.depthSelector, row);
                            displayDepth(depth, row, level);
                            updateRowDisplay(row, level);
                            updateLevelDisplay(level);
                            updateLevelsDisplay();
                        });
                }
            });
        event.preventDefault();
    });

    // Ajout bouton au wrapper
    addDepthButtonWrapper.appendChild(addDepthButton);

    // add col button wrapper
    var addColsButtonWrapper = document.createElement('div');
    addColsButtonWrapper.setAttribute('class', "rows_table_cell rows_table_cell_button");
    // add col button
    var addColButton = document.createElement('button');
    addColButton.setAttribute('id', "add_col_row-" + row.id);
    addColButton.setAttribute('class', "button_add_col");
    addColButton.setAttribute('title', "Add a column for row " + row.id);
    addColButton.innerHTML = extensionLang.AddColButton;
    addColButton.addEventListener("click", function (event) {
        // on efface l'input de title
        let colTitleInput = document.getElementById("col_title");
        colTitleInput.value = "";
        // on efface l'input de tag & class
        let colSelectorInput = document.getElementById("col_tag_class");
        colSelectorInput.value = "";

        // on montre le formulaire
        let addColWrapper = document.getElementById("add_col_wrapper");
        addColWrapper.style.display = "block";

        // on lance le dialogue
        let selectedColTitleArray, selectedColSelectorArray;
        selectCol()
            .then(function (colArray) {
                if (colArray.length === 3) {
                    // avec tag et class
                    let colSelector = colArray[2];
                    highlightCols(level.tabId, row, colSelector, globalColId, level)
                        .then(function(selectedCols) {
                            // add key / title to level type col titles
                            let colTitleKey = colArray[0];
                            let colTitle = colArray[1];
                            fillColTitles(colTitleKey, colTitle);

                            // add col
                            let selectedColTitleArray = [colTitleKey, colTitle];
                            let col = addCol(colSelector, globalColId, selectedColTitleArray, row, level);
                            displayCol(col, row, level);
                            updateRowDisplay(row, level);
                            updateLevelDisplay(level);
                            updateLevelsDisplay();
                        });

                } else if (colArray.length === 2) {
                    // sans tag
                    let colsData = {
                        "row": row,
                        "globalColId": globalColId
                    };
                    sendMessageToTab(level, "selectCols", colsData)
                        .then(function (selectedCols) {
                            //                        console.log("selectedCols : " + selectedCols.colSelector);
                            // add key / title to level type col titles
                            let colTitleKey = colArray[0];
                            let colTitle = colArray[1];
                            fillColTitles(colTitleKey, colTitle);

                            // add col
                            let col = addCol(selectedCols.colSelector, globalColId, colArray, row, level);
                            displayCol(col, row, level);
                            updateRowDisplay(row, level);
                            updateLevelDisplay(level);
                            updateLevelsDisplay();
                        });
                }
            });
        event.preventDefault();
    });
    // Ajout bouton au wrapper
    addColsButtonWrapper.appendChild(addColButton);

    // Ajout
    rowRightWrapper.appendChild(addDepthButtonWrapper);
    rowRightWrapper.appendChild(addColsButtonWrapper);
    //    rowRightWrapper.appendChild(addCustomColsButtonWrapper);
    rowRightWrapper.appendChild(removeRowButtonWrapper);

    // Wrapper total
    var rowWrapper = document.createElement('div');
    rowWrapper.setAttribute('class', "rows_table_row");
    rowWrapper.setAttribute('id', "row_" + row.id);
    rowWrapper.appendChild(rowLeftWrapper);
    rowWrapper.appendChild(rowRightWrapper);

    var rTable = document.createElement('div');
    rTable.setAttribute('class', "rows_table");
    rTable.setAttribute('id', "rows_table_row-" + row.id);
    rTable.appendChild(rowWrapper);
    var tWrapper = document.getElementById("selection_table_wrapper_level-" + level.id);
    tWrapper.appendChild(rTable);
}

function removeRowDisplay(row) {
    var rowWrapper = document.getElementById("rows_table_row-" + row.id);
    rowWrapper.outerHTML = '';
    var colWrapper = document.getElementById("cols_table_row-" + row.id);
    if (colWrapper != null)
        colWrapper.outerHTML = '';
}

// function d'update de row :
// => bouton add depth
// => bouton add col
function updateRowDisplay(row, level) {
    //    console.log("updateRowDisplay : row.depth = " + row.depth);
    // button add depth
    if (row.depth != null)
        disableAddDepthButton(row);
    else
        enableAddDepthButton(row);
}
