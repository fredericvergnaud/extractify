function displayPagination(level) {
    // left wrapper
    var paginationLeftWrapper = document.createElement('div');
    paginationLeftWrapper.setAttribute('class', "pagination_left_wrapper");

    // dataType
    var dataTypeWrapper = document.createElement('div');
    dataTypeWrapper.setAttribute('class', "rows_table_cell rows_table_cell_small");
    dataTypeWrapper.setAttribute('id', "pagination_data_type_wrapper_level-" + level.id);
    dataTypeWrapper.innerHTML = level.pagination.dataType;

    // Couleur
    var colorWrapper = document.createElement('div');
    colorWrapper.setAttribute('class', "rows_table_cell rows_table_cell_small");
    colorWrapper.setAttribute('id', "pagination_color_wrapper_level-" + level.id);
    let colorclass = "";
    if (level.pagination.selector !== "custom pagination")
        colorclass = '<span class="cell_title">color</span><br/><div class="pagination-color highlight_pagination">&nbsp;</div>';
    colorWrapper.innerHTML = colorclass;

    // class name
    var classNameWrapper = document.createElement('div');
    classNameWrapper.setAttribute('class', "rows_table_cell rows_table_cell_big");
    classNameWrapper.setAttribute('id', "pagination_class_name_wrapper_level-" + level.id);
    classNameWrapper.innerHTML = '<span class="cell_title">selector</span><br/>' + level.pagination.selector;

    // Ajout
    paginationLeftWrapper.appendChild(dataTypeWrapper);
    paginationLeftWrapper.appendChild(colorWrapper);
    paginationLeftWrapper.appendChild(classNameWrapper);

    // right wrapper
    var paginationRightWrapper = document.createElement('div');
    paginationRightWrapper.setAttribute('class', "pagination_right_wrapper");

    // Prefix & step
    var prefixAndStepWrapper = document.createElement('div');
    prefixAndStepWrapper.setAttribute('class', "cols_table_cell cols_table_cell_middle");
    prefixAndStepWrapper.setAttribute('id', "pagination_prefix_and_step_wrapper_level-" + level.id);
    prefixAndStepWrapper.innerHTML = '<span class="cell_title">prefix &#126; step</span><br/><span class="cell_result">&apos;' + level.pagination.prefix + '&apos; &#126; ' + level.pagination.step + '</span>';

    // remove pagination button wrapper
    var removePaginationButtonWrapper = document.createElement('div');
    removePaginationButtonWrapper.setAttribute('class', "cols_table_cell cols_table_cell_button");
    // remove pagination button
    var removePaginationButton = document.createElement('button');
    removePaginationButton.setAttribute('id', "remove_pagination_level-" + level.id);
    removePaginationButton.setAttribute('class', "button_remove_pagination");
    removePaginationButton.setAttribute('title', "Remove pagination for level " + level.id);
    removePaginationButton.innerHTML = extensionLang.RemoveButton;
    removePaginationButton.addEventListener("click", function (event) {
        removePagination(level);
        removePaginationDisplay(level);
        updateLevelDisplay(level);
        event.preventDefault();
    });
    // Ajout button à wrapper
    removePaginationButtonWrapper.appendChild(removePaginationButton);

    // Ajout
    paginationRightWrapper.appendChild(prefixAndStepWrapper);
    paginationRightWrapper.appendChild(removePaginationButtonWrapper);

    // Wrapper total
    var paginationWrapper = document.createElement('div');
    paginationWrapper.setAttribute('class', "rows_table");
    paginationWrapper.setAttribute('id', 'pagination_wrapper_level-' + level.id);
    paginationWrapper.appendChild(paginationLeftWrapper);
    paginationWrapper.appendChild(paginationRightWrapper);

    var tWrapper = document.getElementById("selection_table_wrapper_level-" + level.id);
    tWrapper.insertBefore(paginationWrapper, tWrapper.firstChild);
}

function removePaginationDisplay(level) {
    // on supprime la ligne du panel
    if (document.getElementById("pagination_wrapper_level-" + level.id) != null)
        document.getElementById("pagination_wrapper_level-" + level.id).outerHTML = "";
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
