function displayCol(col, row, level) {

    // left wrapper
    var colLeftWrapper = document.createElement('div');
    colLeftWrapper.setAttribute('class', "col_left_wrapper");

    // Type
    var dataTypeWrapper = document.createElement('div');
    dataTypeWrapper.setAttribute('class', "cols_table_cell cols_table_cell_small");
    dataTypeWrapper.setAttribute('id', "col_data_type_wrapper_col-" + col.id);
    dataTypeWrapper.innerHTML = col.dataType;

    // Couleur
    var colorWrapper = document.createElement('div');
    colorWrapper.setAttribute('class', "cols_table_cell cols_table_cell_small");
    colorWrapper.setAttribute('id', "color_wrapper_col-" + col.id);
    colorWrapper.innerHTML = '<span class="cell_title">color</span><br/><div class="col-color highlight_col">&nbsp;</div>';

    // Nom de la classe
    var classNameWrapper = document.createElement('div');
    classNameWrapper.setAttribute('class', "cols_table_cell cols_table_cell_big");
    classNameWrapper.setAttribute('id', "col_class_name_wrapper_col-" + col.id);
    if (col.className != '')
        classNameWrapper.innerHTML = '<span class="cell_title">selector</span><br/>' + col.selector;
    else
        classNameWrapper.innerHTML = '<span class="cell_title">id</span><br/>' + col.idName;

    // Ajout
    colLeftWrapper.appendChild(dataTypeWrapper);
    colLeftWrapper.appendChild(colorWrapper);
    colLeftWrapper.appendChild(classNameWrapper);

    // right wrapper
    var colRightWrapper = document.createElement('div');
    colRightWrapper.setAttribute('class', "col_right_wrapper");

    // Given title
    var givenTitleWrapper = document.createElement('div');
    givenTitleWrapper.setAttribute('class', "cols_table_cell cols_table_cell_middle");
    givenTitleWrapper.setAttribute('id', "col_given_title_wrapper_col-" + col.id);
    givenTitleWrapper.innerHTML = '<span class="cell_title">given title</span><br/><span class="cell_result">' + col.title + '</span>';

    // remove col button wrapper
    var removeColButtonWrapper = document.createElement('div');
    removeColButtonWrapper.setAttribute('class', "cols_table_cell cols_table_cell_button");
    // remove col button
    var removeColButton = document.createElement('button');
    removeColButton.setAttribute('id', "remove_col-" + col.id);
    removeColButton.setAttribute('class', "button_remove_col");
    removeColButton.setAttribute('title', "Remove column " + col.id + " for row " + row.id);
    removeColButton.innerHTML = "Remove";
    removeColButton.addEventListener("click", function (event) {
        // on supprime le col
        removeCol(col, row, level);
        // on supprime le col display
        removeColDisplay(col);
        updateRowDisplay(row, level);
        updateLevelDisplay(level);
        updateLevelsDisplay();
        event.preventDefault();
    });
    // Ajout bouton au wrapper
    removeColButtonWrapper.appendChild(removeColButton);

    // Ajout
    colRightWrapper.appendChild(givenTitleWrapper);
    colRightWrapper.appendChild(removeColButtonWrapper);

    // Wrapper total
    var colWrapper = document.createElement('div');
    colWrapper.setAttribute('class', "cols_table_row");
    colWrapper.setAttribute('id', "col_" + col.id);
    colWrapper.appendChild(colLeftWrapper);
    colWrapper.appendChild(colRightWrapper);

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
        cBody.appendChild(colWrapper);
        // on recherche le tableau du row à la suite duquel on va ajouter le tableau des colonnes
        var row_table = document.getElementById("rows_table_row-" + row.id);
        row_table.parentNode.insertBefore(cTable, row_table.nextSibling);
    } else {
        // on ajoute la col à la suite du body existant
        var cBody = document.getElementById("cols_table_row-" + row.id + "_body");
        cBody.appendChild(colWrapper);
    }
}

function removeColDisplay(col) {
    // on supprime la colonne du panel
    document.getElementById("col_" + col.id).outerHTML = "";
}

function enableAddColButton(row) {
    var addColButton = document.getElementById('add_col_row-' + row.id);
    addColButton.disabled = false;
}

function disableAddColButton(row) {
    var addColButton = document.getElementById("add_col_row-" + row.id);
    addColButton.disabled = true;
}
