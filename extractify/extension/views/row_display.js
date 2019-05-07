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
    colorWrapper.innerHTML = '<span class="cell_title">color</span><br/><div class="row-color highlight_row-' + row.id + '" style="background-color:' + row.color + '">&nbsp;</div>';

    // tag & class
    var classNameWrapper = document.createElement('div');
    classNameWrapper.setAttribute('class', "rows_table_cell rows_table_cell_big");
    classNameWrapper.setAttribute('id', "class_name_wrapper_row-" + row.id);
    classNameWrapper.innerHTML = '<span class="cell_title">tag & class</span><br/>' + row.tagClass;

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
    removeRowButton.innerHTML = 'Remove';
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
    addDepthButton.innerHTML = 'Add<br>depth';
    addDepthButton.addEventListener("click", function (event) {
        var dataArray = {
            "row": row
        };
        sendMessageToTab(level.tabId, "selectDepth", dataArray)
            .then(function (selectedDepth) {
                console.log("selectedDepth.depthTagClass : " + selectedDepth.depthTagClass + " | deeperLinks lenght : " + selectedDepth.deeperLinks.length);
                level.someDeeperLinks.push(...selectedDepth.deeperLinks);
                var depth = addDepth(selectedDepth.depthTagClass, row);
                displayDepth(depth, row, level);
                updateRowDisplay(row, level);
                updateLevelDisplay(level);
                updateLevelsDisplay();
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
    addColButton.innerHTML = 'Add<br>col';
    addColButton.addEventListener("click", function (event) {
        console.log("globalColId = " + globalColId);

        let colTitleSelect = document.getElementById("col_title_select");
        let colTitles = getRemainingColTitles(row, level);

        if (Object.keys(colTitles).length > 0) {
            for (let key in colTitles) {
                let option = document.createElement("option");
                option.setAttribute("value", key);
                option.text = colTitles[key];
                colTitleSelect.add(option);
            }
            // on montre le formulaire
            colTitleSelect.style.display = "block";
            // on lance le dialogue
            let selectedColTitleArray;
            selectColTitle()
                .then(function (colTitleArray) {
                    console.log("colTitleArray choosen = " + colTitleArray);
                    selectedColTitleArray = colTitleArray;
                    var dataArray = {
                        "row": row,
                        "globalColId": globalColId
                    };
                    sendMessageToTab(level.tabId, "selectCols", dataArray)
                        .then(function (selectedCols) {
                            console.log("selectedCols : " + selectedCols.colTagClass);
                            var col = addCol(selectedCols.colTagClass, globalColId, selectedColTitleArray, row, level);
                            displayCol(col, row, level);
                            updateRowDisplay(row, level);
                            updateLevelDisplay(level);
                            updateLevelsDisplay();
                        });
                });
            event.preventDefault();
        }
    });
    // Ajout bouton au wrapper
    addColsButtonWrapper.appendChild(addColButton);

    // add custom col button wrapper
    var addCustomColsButtonWrapper = document.createElement('div');
    addCustomColsButtonWrapper.setAttribute('class', "rows_table_cell rows_table_cell_button");
    // add custom col button
    var addCustomColButton = document.createElement('button');
    addCustomColButton.setAttribute('id', "add_custom_col_row-" + row.id);
    addCustomColButton.setAttribute('class', "button_add_col");
    addCustomColButton.setAttribute('title', "Add a custom column for row " + row.id);
    addCustomColButton.innerHTML = 'Add<br>custom<br>col';
    addCustomColButton.addEventListener("click", function (event) {
        console.log("globalColId = " + globalColId);
        // on efface l'input
        let customColTitleInput = document.getElementById("custom_col_title");
        customColTitleInput.value = "";
        
        // on montre le formulaire
        let addCustomColWrapper = document.getElementById("add_custom_col_wrapper");
        addCustomColWrapper.style.display = "block";
        
        // on lance le dialogue
        let selectedCustomColTitleArray;
        selectCustomColTitle()
            .then(function (customColTitleArray) {
                console.log("customColTitleArray choosen = " + customColTitleArray);
                let customColTitleKey = customColTitleArray[0];
                let customColTitle = customColTitleArray[1];
                fillColTitles(customColTitleKey, customColTitle, level.type);
            
                selectedCustomColTitleArray = customColTitleArray;
                let dataArray = {
                    "row": row,
                    "globalColId": globalColId
                };
                sendMessageToTab(level.tabId, "selectCols", dataArray)
                    .then(function (selectedCols) {
                        console.log("selectedCols : " + selectedCols.colTagClass);
                        let col = addCol(selectedCols.colTagClass, globalColId, selectedCustomColTitleArray, row, level);
                        displayCol(col, row, level);
                        updateRowDisplay(row, level);
                        updateLevelDisplay(level);
                        updateLevelsDisplay();
                        // on le fait disparaitre (bug ?)
                        addCustomColWrapper.style.display = "none";
                    });
            });
        event.preventDefault();
    });
    
// Ajout bouton au wrapper
addCustomColsButtonWrapper.appendChild(addCustomColButton);

// Ajout    
rowRightWrapper.appendChild(addDepthButtonWrapper);
rowRightWrapper.appendChild(addColsButtonWrapper);
rowRightWrapper.appendChild(addCustomColsButtonWrapper);
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
    console.log("updateRowDisplay : row.depth = " + row.depth);
    // button add depth
    if (row.depth != null)
        disableAddDepthButton(row);
    else
        enableAddDepthButton(row);
    // button add col
    var remainingColTitles = getRemainingColTitles(row, level);
    if (Object.keys(remainingColTitles).length === 0)
        disableAddColButton(row);
    else
        enableAddColButton(row);
}
