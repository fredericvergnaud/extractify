function displayDepth(depth, row, level) {

    // left wrapper
    var depthLeftWrapper = document.createElement('div');
    depthLeftWrapper.setAttribute('class', "col_left_wrapper");

    // Data type
    var dataTypeWrapper = document.createElement('div');
    dataTypeWrapper.setAttribute('class', "cols_table_cell cols_table_cell_small");
    dataTypeWrapper.setAttribute('id', "depth_data_type_wrapper_row-" + row.id);
    dataTypeWrapper.innerHTML = depth.dataType;

    // Couleur
    var colorWrapper = document.createElement('div');
    colorWrapper.setAttribute('class', "cols_table_cell cols_table_cell_small");
    colorWrapper.setAttribute('id', "depth_color_wrapper_row-" + row.id);
    colorWrapper.innerHTML = '<div class="depth-color highlight_depth">&nbsp;</div>';

    // Selector
    var selectorWrapper = document.createElement('div');
    selectorWrapper.setAttribute('class', "cols_table_cell cols_table_cell_big");
    selectorWrapper.setAttribute('id', "depth_class_name_wrapper_row-" + row.id);
    let selector = depth.selector;
    if (selector.length > 19) {
      let trimmedSelector = selector.substr(0, 20);
      selector = trimmedSelector + "...";
    }
    selectorWrapper.innerHTML = selector;

    // Ajout
    depthLeftWrapper.appendChild(dataTypeWrapper);
    depthLeftWrapper.appendChild(colorWrapper);
    depthLeftWrapper.appendChild(selectorWrapper);

    // right wrapper
    var depthRightWrapper = document.createElement('div');
    depthRightWrapper.setAttribute('class', "col_right_wrapper");

    // remove depth button wrapper
    var removeDepthButtonWrapper = document.createElement('div');
    removeDepthButtonWrapper.setAttribute('class', "cols_table_cell cols_table_cell_button");
    // remove depth button
    var removeDepthButton = document.createElement('button');
    removeDepthButton.setAttribute('id', "remove_depth_row-" + row.id);
    removeDepthButton.setAttribute('class', "button_remove_depth");
    removeDepthButton.setAttribute('title', "Remove depth for row " + row.id);
    removeDepthButton.innerHTML = extensionLang.RemoveButton;
    removeDepthButton.addEventListener("click", function (event) {
        removeDepth(depth, row, level);
        removeDepthDisplay(depth);
        updateRowDisplay(row, level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
        event.preventDefault();
    });
    // Ajout button au wrapper
    removeDepthButtonWrapper.appendChild(removeDepthButton);

    // Ajout
    depthRightWrapper.appendChild(removeDepthButtonWrapper);

    // Wrapper total
    var depthWrapper = document.createElement('div');
    depthWrapper.setAttribute('class', "cols_table_row depth_row");
    depthWrapper.setAttribute('id', "row-" + row.id + "_depth");
    depthWrapper.appendChild(depthLeftWrapper);
    depthWrapper.appendChild(depthRightWrapper);

    if (document.getElementById("cols_table_row-" + row.id + "_body") === null) {
        // on crée le tableau
        var cTable = document.createElement('div');
        cTable.setAttribute('class', "cols_table");
        cTable.setAttribute('id', "cols_table_row-" + row.id);
        // on crée le body table
        var cBody = document.createElement('div');
        cBody.setAttribute('class', "cols_table_body");
        cBody.setAttribute('id', "cols_table_row-" + row.id + "_body");
        // on ajoute le body au tableau
        cTable.appendChild(cBody);
        // on ajoute la ligne au tableau
        cBody.appendChild(depthWrapper);
        // on recherche le tableau du row à la suite duquel on va ajouter le tableau des colonnes
        var row_table = document.getElementById("rows_table_row-" + row.id);
        row_table.parentNode.insertBefore(cTable, row_table.nextSibling);
    } else {
        // on ajoute la depth en premier enfant du row
        var cBody = document.getElementById("cols_table_row-" + row.id + "_body");
        cBody.insertBefore(depthWrapper, cBody.firstChild);
    }
}

function removeDepthDisplay(depth) {
    // on supprime la depth du row
    document.getElementById("row-" + depth.id + "_depth").outerHTML = "";
}

function enableAddDepthButton(row) {
    var addDepthButton = document.getElementById('add_depth_button_row-' + row.id);
    addDepthButton.disabled = false;
}

function disableAddDepthButton(row) {
    var addDepthButton = document.getElementById("add_depth_button_row-" + row.id);
    addDepthButton.disabled = true;
}
