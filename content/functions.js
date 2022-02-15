// dynamic css
function injectRowsStyles(level) {
  console.log("getColsDepthsStyles = " + getColsDepthsStyles());
  let rowColors = "";
  if (!getColsDepthsStyles()) {
    for (var i = 0; i < 100; i++) {
      // row
      let rowColor = "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)';
      rowColors += ".highlight_row-" + i + " { box-shadow: 0 0 3px #000; background: white; background-color: " + rowColor + " !important; }\n";
    }
    console.log("level.rows.length = " + level.rows.length);
    // si des rows existent déjà, par exemple si on fait un djsonize, on ajoute les couleurs des rows existants
    if (level.rows.length > 0)
      for (row of level.rows)
        rowColors += ".highlight_row-" + row.id + " { box-shadow: 0 0 3px #000; background: white; background-color: " + row.color + " !important; }\n";
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.id = "rowsStylesCSS";
    style.appendChild(document.createTextNode(rowColors));
  } else {
    let style = document.getElementById("colsStylesCSS");
    for (var j = 0; j < 100; j++) {
      // row
      let rowColor = "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)';
      rowColors += ".highlight_row-" + j + " { box-shadow: 0 0 3px #000; background: white; background-color: " + rowColor + " !important; }\n";

    }
    // si des rows existent déjà, par exemple si on fait un djsonize, on ajoute les couleurs des rows existants
    if (level.rows.length > 0)
      for (row of level.rows)
        rowColors += ".highlight_row-" + row.id + " { box-shadow: 0 0 3px #000; background: white; background-color: " + row.color + " !important; }\n";

    style.appendChild(document.createTextNode(rowColors));
  }
}

function injectColsDepthsStyles() {
  let colDepthColors = "";
  if (!getRowsStyles()) {
    for (var i = 0; i < 100; i++) {
      // col-depth
      for (var j = 0; j < 100; j++) {
        colDepthColors += ".highlight_col-" + i + ".highlight_depth-" + j + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(to bottom, coral 50%, #00c3e2 50%) !important; }\n";
      }
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.id = 'colsStylesCSS';
    style.appendChild(document.createTextNode(colDepthColors));
  } else {
    let style = document.getElementById("rowsStylesCSS");
    for (var j = 0; j < 100; j++) {
      // col-depth
      for (var k = 0; k < 100; k++) {
        colDepthColors += ".highlight_col-" + j + ".highlight_depth-" + k + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(to bottom, coral 50%, #00c3e2 50%) !important; }\n";
      }
    }
    style.appendChild(document.createTextNode(colDepthColors));
  }
}

function highlightContent(level) {
  // pagination
  let pagination = level.pagination;
  if (pagination !== null) {
    if (pagination.selector !== "custom pagination") {
      let $paginationSelector = $(pagination.selector).first();
      if ($paginationSelector)
        $paginationSelector.addClass("selected_pagination highlight_pagination");
    }
  }
  // rows
  let rows = level.rows;
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let $rowSelector = $(row.selector);
    //        console.log("$rowSelector : ", $rowSelector);
    $rowSelector.each(function() {
      $this = $(this);
      $this.addClass("selected_row highlight_row-" + row.id);
      // col
      let cols = row.cols;
      for (let j = 0; j < cols.length; j++) {
        let col = cols[j];
        let colSelector = col.selector;
        let $selected_col = $this.find(colSelector).filter(":first");
        if ($selected_col)
          $selected_col.addClass("selected_col highlight_col-" + col.id);
      }
      // depth
      let depth = row.depth;
      if (depth !== null) {
        let depthSelector = depth.selector;
        let $selected_depth = $this.find(depthSelector).filter(":first");
        if ($selected_depth)
          $selected_depth.addClass("selected_depth highlight_depth-" + row.id);
      }
    });
  }
}

function stopContentSelect(level) {
  return new Promise(function(resolve, reject) {
    document.location.reload(true);
  });
}

// Sélection de lignes
const pertinentRowTags = ["li", "tr", "div"];

// Fonction qui récupère l'élément parent le plus pertinent pour un ROW
// Si pas trouvé : retourne un undefined
function getClosestPertinentParentRowTag(element) {
  var rowTagName = element.prop("tagName");
  var closestParent;
  for (var i = 0; i < pertinentRowTags.length; i++) {
    var parent = pertinentRowTags[i];
    closestParent = element.closest(parent);
    if (closestParent.length > 0)
      break;
  }
  return closestParent;
}

function selectRows(rowId, level) {
  var $targetRow;
  return new Promise(function(resolve, reject) {
    // on écoute le mouseover, le mouseout et le click sur les enfants du tag <body>
    $('body').children().on({
      mouseover: function(event) {
        // on récupère la cible survolée
        $targetRow = $(event.target);
        var targetRowTagName = $targetRow.prop("tagName");
        // si la cible est différente de pertinentRowTags, on récupère un parent plus pertinent
        if (pertinentRowTags.indexOf(targetRowTagName) === -1)
          $targetRow = getClosestPertinentParentRowTag($targetRow);
        // si la cible survolée n'a pas de classe selected-row ...
        if (!$targetRow.hasClass("selected_row"))
          $targetRow.addClass("highlight_row-" + rowId);
        return false;
      },
      mouseout: function(event) {
        if (typeof $targetRow !== 'undefined' && !$targetRow.hasClass("selected_row"))
          $targetRow.removeClass("highlight_row-" + rowId);
        return false;
      },
      click: function(event) {
        try {
          event.preventDefault();
          // Première chose : on enlève le highlight qui vient d'être fait
          $targetRow.removeClass("highlight_row-" + rowId);

          var targetRowTagName = $targetRow.prop("tagName");

          if (targetRowTagName !== "LI" && targetRowTagName !== "TR" && targetRowTagName !== "DIV") {
            alert(contentLang.SelectionTagNotSupported);
            return false;
          } else if (!$targetRow.attr('class')) {
            alert(contentLang.RowEmptyClass);
            return false;
          } else if ($targetRow.hasClass("selected_row")) {
            alert(contentLang.RowAlreadySelected);
            return false;
          } else {
            if ($targetRow.attr("class") !== "") {
              // on split les classes de la balise
              var rowClasses = $targetRow.attr("class").split(" ");
              // On construit la structure de classes : .class.class.class ...
              var rowClassName = "." + rowClasses.join(".");
              // On créé un élément jquery selon la structure de classe identifiée
              var $sameTags = $(rowClassName);
              var rowSelector = targetRowTagName + rowClassName;
              if ($sameTags.length === 0) {
                alert(contentLang.RowUnableToSelect + " (" + rowSelector + ")");
                return false;
              } else if ($sameTags.length === 1) {
                if (confirm(contentLang.RowFewElements)) {
                  var rowData = selectRowTags($sameTags, rowSelector, rowId);
                  resolve(rowData);
                } else {
                  alert(contentLang.RowTooFewElements);
                  return false;
                }
              } else {
                var rowData = selectRowTags($sameTags, rowSelector, rowId);
                resolve(rowData);
              }
            } else {
              alert(contentLang.RowEmptyClass);
              return false;
            }
            // on enlève les actions
            $('body').children().unbind();
          }
        } catch (error) {
          alert(error);
        }
        return false;
      }
    });
  });
}

function selectRowTags($sameTags, rowSelector, rowId) {
  // on les surligne
  $sameTags.addClass("selected_row highlight_row-" + rowId);
  // on récupère la couleur
  var rowColor = $sameTags.first().css("background-color");

  var rowData = {
    "rowSelector": rowSelector,
    "rowColor": rowColor
  };
  return rowData;
}

function highlightRows(rowSelector, rowId, level) {
  return new Promise(function(resolve, reject) {
    let $rowSelector;
    try {
      $rowSelector = $(rowSelector);
      console.log("$rowSelector length = " + $rowSelector.length + " : ", $rowSelector);
      console.log("level id = " + level.id);
      if ($rowSelector.length === 0)
        alert(contentLang.RowUnableToSelect + " (" + rowSelector + ")");
      else if ($rowSelector.hasClass("selected_row"))
        alert(contentLang.RowAlreadySelected);
      else if ($rowSelector.length === 1) {
        if (confirm(contentLang.RowFewElements)) {
          var rowData = selectRowTags($rowSelector, rowSelector, rowId);
          resolve(rowData);
        } else
          alert(contentLang.RowTooFewElements);
      } else {
        var rowData = selectRowTags($rowSelector, rowSelector, rowId)
        resolve(rowData);
      }
    } catch (error) {
      alert(error);
    }
  });
}

function removeHighlightedElement(element) {
  console.log("remove class pour element " + element.dataType + " " + element.id);
  try {
    var targetClass, classToRemove;
    if (element.dataType != 'pagination') {
      targetClass = ".highlight_" + element.dataType + "-" + element.id;
      classToRemove = "selected_" + element.dataType + " highlight_" + element.dataType + "-" + element.id;
    } else {
      targetClass = ".highlight_pagination";
      classToRemove = "selected_pagination highlight_pagination";
    }
    $targetClass = $(targetClass);
    $targetClassChildren = $targetClass.children();
    $targetClass.removeClass(classToRemove);
    if ($targetClassChildren.length > 0)
      $targetClassChildren.removeClass(classToRemove);
  } catch (error) {
    alert(error);
  }
}

// Sélection de colonne

// Fonction qui vérifie si l'élément (colonne ou depth) survolé appartient à une ligne sélectionnée
function hasSelectedParentRow(element, row) {
  var hasSelectedParentRow = false;
  var rowSelector = row.selector;
  if (element.parents(rowSelector).length)
    hasSelectedParentRow = true;
  return hasSelectedParentRow;
}

function selectCols(row, colId) {
  return new Promise(function(resolve, reject) {
    var $targetCol;
    $('body').children().on({
      mouseover: function(event) {
        // on récupère la cible survolée
        $targetCol = $(event.target);
        // si la cible fait partie d'une ligne sélectionnée : on la colorie
        if (hasSelectedParentRow($targetCol, row) && !$targetCol.hasClass("selected_col"))
          $targetCol.addClass("highlight_col-" + colId);
        return false;
      },
      mouseout: function(event) {
        if (typeof $targetCol !== 'undefined')
          $targetCol.removeClass("highlight_col-" + colId);
        return false;
      },
      click: function(event) {
        try {
          event.preventDefault();
          // on efface le highlight qui vient d'être fait
          $targetCol.removeClass("highlight_col-" + colId);
          if (!$targetCol.attr('class')) {
            alert(contentLang.ColEmptyClass);
            return false;
          } else if ($targetCol.hasClass("selected_col")) {
            alert(contentLang.ColAlreadySelected);
            return false;
          } else if (!hasSelectedParentRow($targetCol, row)) {
            alert(contentLang.ColNotRowChild);
            return false;
          } else {
            var hasDepth = false;
            // on check si depth ou pas pour la supprimer afin de récupérer la classe initiale de la balise
            if ($targetCol.hasClass("selected_depth")) {
              hasDepth = true;
              $targetCol.removeClass("selected_depth highlight_depth-" + row.id);
            }
            var colTagName = $targetCol.prop("tagName");
            // On construit la structure qui désignera la classe des tags identiques
            if ($targetCol.attr("class") !== "") {
              var targetColClasses = $targetCol.attr("class").split(" ");
              console.log("targetColClasses length = ", targetColClasses.length);
              var colClassName = "." + targetColClasses.join(".");
              console.log("colClassName = ", colClassName);
              // On créé un élément jquery selon la structure identifiée
              var $sameTags = $(colClassName);
              var colSelector = colTagName + colClassName;
              if ($sameTags.length === 0) {
                alert(contentLang.ColUnableToSelect + " (" + colSelector + ")");
                return false;
              } else if ($sameTags.length === 1) {
                if (confirm(contentLang.ColFewElements)) {
                  var colData = selectColTags(row, colSelector, colId, hasDepth);
                  resolve(colData);
                } else {
                  alert(contentLang.ColTooFewElements);
                  return false;
                }
              } else {
                var colData = selectColTags(row, colSelector, colId, hasDepth);
                resolve(colData);
              }
            } else {
              alert(contentLang.ColEmptyClass);
              return false;
            }
            // on enlève les actions
            $('body').children().unbind();
          }
        } catch (error) {
          alert(error);
        }
        return false;
      }
    });
  });
}

function selectColTags(row, colSelector, colId, hasDepth) {
  $selected_col = $(row.selector).find(colSelector);
  $selected_col.addClass("selected_col highlight_col-" + colId);
  if (hasDepth)
    $selected_col.addClass("selected_depth highlight_depth-" + row.id);
  // $(row.selector).each(function() {
  //   $selected_col = $(this).find(colSelector);
  //   $selected_col.addClass("selected_col highlight_col-" + colId);
  //   if (hasDepth)
  //     $selected_col.addClass("selected_depth highlight_depth-" + row.id);
  // });
  var colData = {
    "colSelector": colSelector
  };
  return colData;
}

function highlightCols(row, colSelector, colId, level) {
  return new Promise(function(resolve, reject) {
    let $colSelector;
    try {
      $colSelector = $(row.selector).find($(colSelector));
      console.log("$colSelector = ", $colSelector);
      if ($colSelector.length === 0)
        alert(contentLang.ColUnableToSelect + " (" + colSelector + ")");
      else if ($colSelector.hasClass("selected_col"))
        alert(contentLang.ColAlreadySelected);
      else if (!hasSelectedParentRow($colSelector, row))
        alert(contentLang.ColNotRowChild);
      else if ($colSelector.length === 1) {
        if (confirm(contentLang.ColFewElements)) {
          var colData = selectColTags(row, colSelector, colId, false);
          resolve(colData);
        } else {
          alert(contentLang.ColTooFewElements);
        }
      } else {
        var colData = selectColTags(row, colSelector, colId, false);
        resolve(colData);
      }
    } catch (error) {
      alert(error);
    }
  });
}

function selectDepth(row) {
  return new Promise(function(resolve, reject) {
    var $targetDepth;
    $('body').children().on({
      mouseover: function(event) {
        // on récupère la cible survolée
        $targetDepth = $(event.target);
        // si la cible fait partie d'une ligne sélectionnée et est une balise <a> : on la colorie
        if (hasSelectedParentRow($targetDepth, row) && $targetDepth.prop("tagName") == "A")
          $targetDepth.addClass("highlight_depth-" + row.id);
        return false;
      },
      mouseout: function(event) {
        if (typeof $targetDepth !== 'undefined' && !$targetDepth.hasClass("selected_depth"))
          $targetDepth.removeClass("highlight_depth-" + row.id);
        return false;
      },
      click: function(event) {
        try {
          event.preventDefault();
          // on efface le highlight qui vient d'être fait
          $targetDepth.removeClass("highlight_depth-" + row.id);
          // on récupère le tagName original
          var targetDepthTagName = $targetDepth.prop("tagName");
          if (targetDepthTagName !== "A") {
            alert(contentLang.InvalidSelectionLink);
            return false;
          } else if (!$targetDepth.attr('class')) {
            alert(contentLang.DepthEmptyClass);
            return false;
          } else if ($targetDepth.hasClass("selected_depth")) {
            alert(contentLang.DepthAlreadySelected);
            return false;
          } else if (!hasSelectedParentRow($targetDepth, row)) {
            alert(contentLang.LinkNotRowChild);
            return false;
          } else {
            // on check si col ou pas
            // on a besoin de retrouver l'id col pour supprimer highlight_col-colId
            var hasCol = false;
            var colId;
            if ($targetDepth.hasClass("selected_col")) {
              hasCol = true;
              var colClasses = $targetDepth.attr("class").split(" ");
              for (var i = 0; i < colClasses.length; i++) {
                var colClassName = colClasses[i];
                if (colClassName.indexOf("highlight_col-") !== -1) {
                  colId = colClassName.substr(colClassName.indexOf("highlight_col-") + 14);
                  break;
                }
              }
            }
            if (hasCol)
              $targetDepth.removeClass("selected_col highlight_col-" + colId);

            if ($targetDepth.attr("class") !== "") {
              // On construit la structure qui désignera la classe des tags identiques
              var targetDepthClasses = $targetDepth.attr("class");
              var depthClasses = targetDepthClasses.split(" ");
              var depthClassName = "." + depthClasses.join(".");

              // On créé un élément jquery selon la structure identifiée
              var $sameTags = $(depthClassName);
              var depthSelector = targetDepthTagName + depthClassName;
              if ($sameTags.length === 0) {
                alert(contentLang.DepthUnableToSelect + " (" + depthSelector + ")");
                return false;
              } else if ($sameTags.length === 1) {
                if (confirm(contentLang.DepthFewElements)) {
                  var depthData = selectDepthTags(row, depthSelector, colId, hasCol);
                  resolve(depthData);
                } else {
                  alert(contentLang.ColTooFewElements);
                  return false;
                }
              } else {
                var depthData = selectDepthTags(row, depthSelector, colId, hasCol);
                resolve(depthData);
              }
            } else {
              alert(contentLang.DepthEmptyClass);
              return false;
            }
            // on enlève les actions
            $('body').children().unbind();
          }
        } catch (error) {
          alert(error);
        }
        return false;
      }
    });
  });
}

function selectDepthTags(row, depthSelector, colId, hasCol) {
  var deeperLinks = [];
  $selected_depth = $(row.selector).find(depthSelector);
  $selected_depth.addClass("selected_depth highlight_depth-" + row.id);
  if (hasCol)
    $selected_depth.addClass("selected_col highlight_col-" + colId);
  $selected_depth.each(function() {
    var $thisText = $(this).text();
    // test sur le texte : doit être différent d'un nombre
    if (!$.isNumeric($thisText)) {
      var href = $(this).prop("href");
      console.log("href = ", href);
      if (href !== null)
        deeperLinks.push(href);
    }
  });

  var depthData = {
    "depthSelector": depthSelector,
    "deeperLinks": deeperLinks
  };
  return depthData;
}

function highlightDepth(row, depthSelector) {
  return new Promise(function(resolve, reject) {
    let $depthSelector;
    try {
      $depthSelector = $(row.selector).find($(depthSelector));
      if ($depthSelector.prop("tagName") !== "A")
        alert(contentLang.InvalidSelectionLink);
      else if ($depthSelector.hasClass("selected_depth"))
        alert(contentLang.DepthAlreadySelected);
      else if (!hasSelectedParentRow($depthSelector, row))
        alert(contentLang.LinkNotRowChild);
      else if ($depthSelector.length === 0)
        alert(contentLang.DepthUnableToSelect + " (" + depthSelector + ")");
      else if ($depthSelector.length === 0) {
        if (confirm(contentLang.DepthFewElements)) {
          var depthData = selectDepthTags(row, depthSelector, null, false);
          resolve(depthData);
        } else {
          alert(contentLang.ColTooFewElements);
        }
      } else {
        var depthData = selectDepthTags(row, depthSelector, null, false);
        resolve(depthData);
      }
    } catch (error) {
      alert(error);
    }
  });
}



// PAGINATION

function selectPagination() {
  return new Promise(function(resolve, reject) {
    var $targetPagination;
    $('body').children().bind({
      mouseover: function(event) {
        $targetPagination = $(event.target);
        $targetPagination.addClass("highlight_pagination");
        return false;
      },
      mouseout: function(event) {
        if (typeof $targetPagination !== 'undefined' && !$targetPagination.hasClass("selected_pagination"))
          $targetPagination.removeClass("highlight_pagination");
        return false;
      },
      click: function(event) {
        try {
          event.preventDefault();
          // on efface le highlight sur la cible
          $targetPagination.removeClass("highlight_pagination");

          if (!$targetPagination.attr('class')) {
            alert(contentLang.PaginationEmptyClass);
            return false;
          } else if ($targetPagination.hasClass("selected_pagination")) {
            alert(contentLang.PaginationAlreadySelected);
            return false;
          } else {
            var paginationSelector = "";
            // classe
            var paginationClasses = $targetPagination.attr("class").split(" ");
            var paginationClassName = "." + paginationClasses.join(".");
            // tag
            var paginationTagName = $targetPagination.prop("tagName");

            paginationSelector = paginationTagName + paginationClassName;

            // paginationLinks : uniquement pour trouver le nombre de liens sélectionnés
            var paginationLinks = new Set();

            if (paginationTagName === "A") {
              paginationLinks.add($targetPagination.prop("href"));
            } else {
              $paginationLinks = $targetPagination.find("a");
              $paginationLinks.each(function() {
                paginationLinks.add($(this).prop("href"));
              });
            }
            console.log("paginationLinks size : ", paginationLinks.size);
            console.log("paginationLinks : ", paginationLinks);

            if (checkIfPertinentPaginationSelection(resolve, paginationSelector, paginationLinks))
              $('body').children().unbind();
            else
              return false;
          }
        } catch (error) {
          alert(error);
        }
        return false;
      }
    });
  });
}

function selectPaginationTags(paginationSelector) {
  if (paginationSelector !== "noSelector") {
    let $paginationSelector = $(paginationSelector);
    // on les surligne
    $paginationSelector.addClass("selected_pagination highlight_pagination");
  }
  var paginationData = {
    "paginationSelector": paginationSelector
  };
  return paginationData;
}

function highlightPagination(level, paginationSelector) {
  return new Promise(function(resolve, reject) {
    let $paginationSelector;
    try {
      $paginationSelector = $(paginationSelector);
      if ($paginationSelector.hasClass("selected_pagination"))
        alert(contentLang.PaginationAlreadySelected);
      else if ($paginationSelector.length === 0)
        alert(contentLang.PaginationUnableToSelect + " (" + paginationSelector + ")");
      else {
        let paginationLinks = new Set();
        if ($paginationSelector.prop("tagName") === "A") {
          paginationLinks.add($paginationSelector.prop("href"));
        } else {
          $paginationLinks = $paginationSelector.find("a");
          $paginationLinks.each(function() {
            paginationLinks.add($(this).prop("href"));
          });
        }
        console.log("paginationLinks : ", paginationLinks);
        checkIfPertinentPaginationSelection(resolve, paginationSelector, paginationLinks);
      }
    } catch (error) {
      alert(error);
    }
  });
}

function selectCustomPagination(customPaginationData) {
  console.log("customPaginationData : ", customPaginationData);
  return new Promise(function(resolve, reject) {
    // get links from constant string
    let constantUrl = customPaginationData[0];
    let paginationLinks = new Set();
    try {
      if (constantUrl.startsWith("****") || constantUrl.endsWith("****")) {
        constantUrl = constantUrl.replace("****", "");
        console.log("constantUrl : ", constantUrl);
        $("a").each(function() {
          let linkHref = $(this).prop("href");
          if (linkHref.indexOf(constantUrl) > -1)
            paginationLinks.add(linkHref);
        });
      }
      else {
        let constantUrlArray = constantUrl.split("****");
        console.log("constantUrlArray after split : ", constantUrlArray);
        $("a").each(function() {
          let linkHref = $(this).prop("href");
          if (linkHref.indexOf(constantUrlArray[0]) > -1 && linkHref.indexOf(constantUrlArray[1]) > -1)
            paginationLinks.add(linkHref);
        });
      }
      console.log("paginationLinks : ", paginationLinks);
      if (!checkIfPertinentPaginationSelection(resolve, "noSelector", paginationLinks))
        resolve("cancel");
    } catch (error) {
      alert(error);
    }
  });
}

function checkIfPertinentPaginationSelection(resolve, paginationSelector, paginationLinks) {
  let paginationData;
  let isPertinentPafinationSelection = true;
  if (paginationLinks.size === 0) {
    alert(contentLang.UnableToFindLinksForPaginationPages);
    isPertinentPafinationSelection = false;
  } else if (paginationLinks.size === 1) {
    if (confirm(contentLang.PaginationFewElements)) {
      // on resolve
      paginationData = selectPaginationTags(paginationSelector);
      resolve(paginationData);
    } else
      isPertinentPafinationSelection = false;
  } else {
    // test de pertinence : on essaye de trouver une chaine de caractère constante dans les urls et un step pair, divisible par 5 ou égal à 1
    let constantUrlAndStepInUrls = getConstantUrlAndStepInUrls([...paginationLinks]);
    console.log("constantUrlAndStepInUrls : ", constantUrlAndStepInUrls);
    let foundConstantUrl = constantUrlAndStepInUrls.constantUrl;
    let foundStep = constantUrlAndStepInUrls.step;
    if ((foundConstantUrl !== "" && foundConstantUrl !== undefined && foundStep !== 0) && (foundStep % 2 == 0 || foundStep % 5 == 0 || foundStep == 1)) {
      // on resolve
      paginationData = selectPaginationTags(paginationSelector);
      resolve(paginationData);
    } else {
      if (confirm(contentLang.PaginationConstantUrlAndStepNotFound)) {
        // on resolve
        paginationData = selectPaginationTags(paginationSelector);
        resolve(paginationData);
      } else
        isPertinentPafinationSelection = false;
    }
  }
  return isPertinentPafinationSelection;
}

function getConstantUrlAndStepInUrls(links) {
  let constantUrlAndStepInUrls = {};
  // Constant url in urls
  let constantUrl, constantUrls = new Map(), step, pagesNumbers = new Set();
  for (let i = 0; i < links.length; i++) {
    for (let j = i + 1; j < links.length; j++) {
      let differenceBetweenLinks = parseInt(getDifferenceBetweenLinks(links[i], links[j])) || 0;
      // console.log("difference between " + links[i] + " and " + links[j] + " : ", differenceBetweenLinks);
      if (differenceBetweenLinks !== 0) {
        pagesNumbers.add(differenceBetweenLinks);
        let constantUrlFound = links[j].replace(differenceBetweenLinks, "****");
        // console.log("constantUrlFound = ", constantUrlFound);
        if (constantUrls.has(constantUrlFound))
          constantUrls.set(constantUrlFound, constantUrls.get(constantUrlFound)+1);
        else
          constantUrls.set(constantUrlFound, 1);
      }
    }
  }
  if (constantUrls.size > 0) {
    let constantUrlsSortedArray = [...constantUrls.entries()].sort((a, b) => b[1] - a[1]);
    console.log("constantUrlsSortedArray : ", constantUrlsSortedArray);
    constantUrlAndStepInUrls.constantUrl = constantUrlsSortedArray[0][0];
  } else {
    constantUrlAndStepInUrls.constantUrl = "";
  }

  // Step in urls
  let steps = new Map(), pagesNumbersArray = [...pagesNumbers];
  if (pagesNumbersArray.length > 1) {
    for (let i = 0; i < pagesNumbersArray.length - 1; i++) {
      let pageNumber = pagesNumbersArray[i];
      let pageNumberNext = pagesNumbersArray[i + 1];
      let diff = pageNumberNext - pageNumber;
      // console.log("diff = ", diff);
      if (diff > 0) {
        if (steps.has(diff))
          steps.set(diff, steps.get(diff)+1);
        else
          steps.set(diff, 1);
      }
    }
    // on trie steps
    if (steps.size > 0) {
      let stepsSortedArray = [...steps.entries()].sort((a, b) => b[1] - a[1]);
      console.log("stepsSortedArray : ", stepsSortedArray);
      constantUrlAndStepInUrls.step = stepsSortedArray[0][0];
    }
  } else
    constantUrlAndStepInUrls.step = 0;

  return constantUrlAndStepInUrls;
}

//
// SCRAPPING
//

function getScrapedPage(levelStructureMap, rowNbr) {
  // console.log("getScrapedPage : levelStructureMap = ", levelStructureMap);
  let map = new Map();
  for (let [rowSelector, rowChildrenSelector] of levelStructureMap) {
    $rowSelector = $(rowSelector);
    // console.log("$rowSelector : ", $rowSelector);
    let childUrl = "";
    $rowSelector.each(function() {
      let mapId = [];
      let rowChildren = {};
      for (rowChildSelectors of rowChildrenSelector) {
        let rowChildSelectorArray = rowChildSelectors.split("***");
        let rowChildTitle = rowChildSelectorArray[0];
        let rowChildSelector = rowChildSelectorArray[1];
        let $child = $(this).find(rowChildSelector);
        let childText = "";
        if ($child.length === 1)
          childText = $child.text();
        else {
          $child.each(function() {
            childText += $(this).text() + " * ";
          });
          childText = childText.slice(0, -3);
        }
        // let childText = $(this).find(rowChildSelector).filter(":first").text() + ", ";
        // console.log("childText : " + childText);
        if (childText !== null && childText !== undefined) {
          if (rowChildTitle === "url") {
            childText = $(this).find(rowChildSelector).prop("href");
            childUrl = childText;
          }
          rowChildren[rowChildTitle] = childText;
        }
      }
      if (Object.keys(rowChildren).length > 0) {
        mapId[0] = rowNbr;
        mapId[1] = childUrl;
        map.set(mapId, rowChildren);
      }
      rowNbr++;
    });
  }
  return map;
}

function getPaginationLinks(pagination) {
  let paginationLinks,
    selector = pagination.selector,
    constantUrl = pagination.constantUrl,
    start = pagination.start,
    step = pagination.step,
    stop = pagination.stop;
  // By selector
  if (selector !== "noSelector")
    paginationLinks = getPaginationLinksWithSelector(selector);
  else
    paginationLinks = getPaginationLinksWithConstantUrl(constantUrl, start, step, stop);

  return paginationLinks;
}

function getPaginationLinksWithSelector(selector) {
  // By Selector
  console.log("Get pagination links with selector : ")
  let paginationLinks = new Set();
  let $urls = $(selector).find("a");
  if ($urls.length > 0)
    $urls.each(function() {
      $href = $(this).prop("href");
      paginationLinks.add($href);
    });
  console.log("paginationLinks : ", paginationLinks);
  return [...paginationLinks];
}

function getPaginationLinksWithConstantUrl(constantUrl, start, step, stop) {
  // Stop est déterminé
  let paginationLinks = new Set();
  console.log("Create link with constantUrl = " + constantUrl + " | start = " + start + " | step = " + step + " | stop = " + stop);
  for (let i = start; i < stop + step;) {
    let paginationLink = constantUrl.replace("****", i);
    paginationLinks.add(paginationLink);
    i += step;
  }
  console.log("paginationLinks = ", paginationLinks);
  return [...paginationLinks];
}

function getDifferenceBetweenLinks(a, b) {
  var i = 0;
  var j = 0;
  var result = "";
  while (j < b.length) {
    if (a[i] != b[j] || i == a.length)
      result += b[j];
    else
      i++;
    j++;
  }
  return result;
}
