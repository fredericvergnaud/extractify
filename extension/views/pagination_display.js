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
  if (level.pagination.selector !== "noSelector")
    colorclass = '<div class="pagination-color highlight_pagination">&nbsp;</div>';
  colorWrapper.innerHTML = colorclass;

  // Selector : class name or ConstantUrl & step
  var selectorWrapper = document.createElement('div');
  selectorWrapper.setAttribute('class', "cols_table_cell cols_table_cell_middle");
  selectorWrapper.setAttribute('id', "pagination_constantUrl_and_step_wrapper_level-" + level.id);
  let selector;
  if (level.pagination.constantUrl !== undefined && level.pagination.constantUrl !== "") {
    let constantUrl = level.pagination.constantUrl;
    let constantUrlURL = new URL(constantUrl);
    let pathnameConstantUrlURL = constantUrlURL.pathname;
    console.log("pathnameConstantUrlURL : ", pathnameConstantUrlURL);
    let constantUrlSubstr = constantUrl.substr(constantUrl.indexOf(pathnameConstantUrlURL));
    console.log("constantUrlSubstr : ", constantUrlSubstr);
    let trimmedConstantUrl;
    if (constantUrlSubstr.length > 29) {
      trimmedConstantUrl = pathnameConstantUrlURL.substr(0, 30);
      trimmedConstantUrl = trimmedConstantUrl + "...";
    } else
      trimmedConstantUrl = constantUrlSubstr;
    selector = '<span class="cell_result">' + trimmedConstantUrl + '<br/>' + level.pagination.start + ' &#126; ' + level.pagination.step + ' &#126; ' + level.pagination.stop + '</span>';
  } else {
    if (level.pagination.selector !== "noSelector") {
      selector = level.pagination.selector;
      if (selector.length > 29) {
        let trimmedSelector = selector.substr(0, 30);
        selector = trimmedSelector + "...";
      }
    } else
      selector = 'None';
  }
  selectorWrapper.innerHTML = selector;

  // Ajout
  paginationLeftWrapper.appendChild(dataTypeWrapper);
  paginationLeftWrapper.appendChild(colorWrapper);
  paginationLeftWrapper.appendChild(selectorWrapper);

  // right wrapper
  var paginationRightWrapper = document.createElement('div');
  paginationRightWrapper.setAttribute('class', "pagination_right_wrapper");

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

  // Ajout
  paginationRightWrapper.appendChild(removePaginationButtonWrapper);

  // Wrapper total
  var paginationWrapper = document.createElement('div');
  paginationWrapper.setAttribute('class', "pagination_table_row selection_table_row_level-" + level.id);
  paginationWrapper.setAttribute('id', 'pagination_wrapper_level-' + level.id);
  paginationWrapper.addEventListener("mouseover", function(event) {
    paginationRightWrapper.style.display = "block";
    event.preventDefault();
  });
  paginationWrapper.addEventListener("mouseleave", function(event) {
    paginationRightWrapper.style.display = "none";
    event.preventDefault();
  });
  paginationWrapper.appendChild(paginationLeftWrapper);
  paginationWrapper.appendChild(paginationRightWrapper);

  var tableHeaderWrapper = document.getElementById("selection_table_header_wrapper_level-" + level.id);
  tableHeaderWrapper.parentNode.insertBefore(paginationWrapper, tableHeaderWrapper.nextSibling);

  // par défaut on cache le right wrapper
  paginationRightWrapper.style.display = "none";
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
