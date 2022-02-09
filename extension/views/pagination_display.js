function displayPagination(level) {

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
  if (level.pagination.selector !== "noSelector")
    colorclass = '<div class="pagination-color highlight_pagination">&nbsp;</div>';
  colorWrapper.innerHTML = colorclass;

  // Selector : class name or ConstantString & step
  var selectorWrapper = document.createElement('div');
  selectorWrapper.setAttribute('class', "cols_table_cell cols_table_cell_middle");
  selectorWrapper.setAttribute('id', "pagination_constantString_and_step_wrapper_level-" + level.id);
  if (level.pagination.constantString !== "") {
    let constantString = level.pagination.constantString;
    let constantStringURL = new URL(constantString);
    let pathnameConstantStringURL = constantStringURL.pathname;
    let trimmedConstantString = pathnameConstantStringURL.substr(0, 20);
    trimmedConstantString = trimmedConstantString + "...";
    selectorWrapper.innerHTML = '<span class="cell_result">' + trimmedConstantString + '<br/>' + level.pagination.start + ' &#126; ' + level.pagination.step + ' &#126; ' + level.pagination.stop + '</span>';
  } else {
    let selector;
    if (level.pagination.selector !== "noSelector") {
      selector = level.pagination.selector;
      if (selector.length > 19) {
        let trimmedSelector = selector.substr(0, 20);
        selector = trimmedSelector + "...";
      }
    } else
      selector = 'None';
    selectorWrapper.innerHTML = selector;
  }

  // remove pagination button wrapper
  var removePaginationButtonWrapper = document.createElement('div');
  removePaginationButtonWrapper.setAttribute('class', "cols_table_cell cols_table_cell_button");
  // remove pagination button
  var removePaginationButton = document.createElement('button');
  removePaginationButton.setAttribute('id', "remove_pagination_level-" + level.id);
  removePaginationButton.setAttribute('class', "button_remove_pagination");
  removePaginationButton.setAttribute('title', "Remove pagination for level " + level.id);
  // removePaginationButton.innerHTML = extensionLang.RemoveButton;
  removePaginationButton.innerHTML = "";
  removePaginationButton.addEventListener("click", function(event) {
    removePagination(level);
    removePaginationDisplay(level);
    updateLevelDisplay(level);
    event.preventDefault();
  });
  // Ajout button à wrapper
  removePaginationButtonWrapper.appendChild(removePaginationButton);

  // Wrapper total
  var paginationWrapper = document.createElement('div');
  paginationWrapper.setAttribute('class', "pagination_table_row selection_table_row_level-" + level.id);
  paginationWrapper.setAttribute('id', 'pagination_wrapper_level-' + level.id);
  paginationWrapper.addEventListener("mouseover", function(event) {
    console.log("hello");
    if (paginationRightWrapper !== null && paginationRightWrapper !== undefined)
      paginationRightWrapper.style.display = "inline-block";
    event.preventDefault();
  });
  paginationWrapper.addEventListener("mouseleave", function(event) {
    if (paginationRightWrapper !== null && paginationRightWrapper !== undefined)
      paginationRightWrapper.style.display = "none";
    event.preventDefault();
  });
  paginationWrapper.appendChild(dataTypeWrapper);
  paginationWrapper.appendChild(colorWrapper);
  paginationWrapper.appendChild(selectorWrapper);
  paginationWrapper.appendChild(removePaginationButtonWrapper);
  // par défaut on cache le right wrapper
  removePaginationButtonWrapper.style.display = "none";

  var tableHeaderWrapper = document.getElementById("selection_table_header_wrapper");
  if (tableHeaderWrapper !== null)
    tableHeaderWrapper.appendChild(paginationWrapper);
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
