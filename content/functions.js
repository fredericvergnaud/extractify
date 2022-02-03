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
        colDepthColors += ".highlight_col-" + i + ".highlight_depth-" + j + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(coral,#77dd77) !important; }\n";
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
        colDepthColors += ".highlight_col-" + j + ".highlight_depth-" + k + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(coral,#77dd77) !important; }\n";
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
  // $(row.selector).each(function() {
  //   $selected_depth = $(this).find(depthSelector).filter(":first");
  //   $selected_depth.addClass("selected_depth highlight_depth-" + row.id);
  //   if (hasCol)
  //     $selected_depth.addClass("selected_col highlight_col-" + colId);
  //   var $thisText = $selected_depth.text();
  //   // test sur le texte : doit être différent d'un nombre
  //   if (!$.isNumeric($thisText)) {
  //     var href = $selected_depth.prop("href");
  //     if (href !== null)
  //       deeperLinks.push(href);
  //   }
  // });
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

//function getCleanedPaginationClass(targetElement) {
//    var targetElementClassName = targetElement.attr("class");
//    if (targetElementClassName.length === 0) {
//        var newTargetElement = targetElement.parent('[class]');
//        var newTargetElementClassName = newTargetElement.attr("class");
//
//        if (typeof newTargetElementClassName === 'undefined' || newTargetElementClassName.length === 0)
//            return null;
//        else
//            return getCleanedPaginationClass(newTargetElement);
//    } else
//        return targetElement;
//}

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

            checkIfPertinentPaginationSelection(resolve, paginationSelector, paginationLinks);

            // var paginationClasses = targetPagination.attr("class").split(" ");
            // var paginationClassName = "." + paginationClasses.join(".");
            // var paginationSelector = paginationTagName + paginationClassName;
            // let constantStringAndStep = getPaginationConstantStringAndStep("selector", paginationSelector);
            // if (constantStringAndStep.length > 0) {
            //   console.log("selectPagination : constantStringAndStep found : ", constantStringAndStep);
            //   // on highlight
            //   targetPagination.addClass("selected_pagination highlight_pagination");
            //   // on resolve
            //   var paginationData = {
            //     "paginationSelector": paginationSelector,
            //     "paginationConstantString": constantStringAndStep[0],
            //     "paginationStep": constantStringAndStep[1]
            //   };
            //   resolve(paginationData);
            //   // on enlève les actions
            //   $('body').children().unbind();
            // } else {
            //   alert(contentLang.UnableToResolvePaginationPages);
            //   return false;
            // }

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

// function selectPagination_old() {
//   return new Promise(function(resolve, reject) {
//     var targetPagination;
//     $('body').children().bind({
//       mouseover: function(event) {
//         targetPagination = $(event.target);
//         targetPagination.addClass("highlight_pagination");
//         return false;
//       },
//       mouseout: function(event) {
//         if (typeof targetPagination !== 'undefined' && !targetPagination.hasClass("selected_pagination"))
//           targetPagination.removeClass("highlight_pagination");
//         return false;
//       },
//       click: function(event) {
//         event.preventDefault();
//         // on efface le highlight sur la cible
//         targetPagination.removeClass("highlight_pagination");
//         if (!targetPagination.attr('class')) {
//           alert(contentLang.PaginationEmptyClass);
//           return false;
//         } else if (targetPagination.hasClass("selected_pagination")) {
//           alert(contentLang.PaginationAlreadySelected);
//           return false;
//         } else {
//           var paginationTagName = targetPagination.prop("tagName");
//           var paginationClasses = targetPagination.attr("class").split(" ");
//           var paginationClassName = "." + paginationClasses.join(".");
//           var paginationSelector = paginationTagName + paginationClassName;
//           let constantStringAndStep = getPaginationConstantStringAndStep("selector", paginationSelector);
//           if (constantStringAndStep.length > 0) {
//             console.log("selectPagination : constantStringAndStep found : ", constantStringAndStep);
//             // on highlight
//             targetPagination.addClass("selected_pagination highlight_pagination");
//             // on resolve
//             var paginationData = {
//               "paginationSelector": paginationSelector,
//               "paginationConstantString": constantStringAndStep[0],
//               "paginationStep": constantStringAndStep[1]
//             };
//             resolve(paginationData);
//             // on enlève les actions
//             $('body').children().unbind();
//           } else {
//             alert(contentLang.UnableToResolvePaginationPages);
//             return false;
//           }
//         }
//         return false;
//       }
//     });
//   });
// }

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
    let constantString = customPaginationData[0];
    let paginationLinks = new Set();
    try {
      if (constantString.startsWith("****") || constantString.endsWith("****")) {
        constantString = constantString.replace("****", "");
        console.log("constantString : ", constantString);
        $("a").each(function() {
          let linkHref = $(this).prop("href");
          if (linkHref.indexOf(constantString) > -1)
            paginationLinks.add(linkHref);
        });
      }
      else {
        let constantStringArray = constantString.split("****");
        console.log("constantStringArray after split : ", constantStringArray);
        $("a").each(function() {
          let linkHref = $(this).prop("href");
          if (linkHref.indexOf(constantStringArray[0]) > -1 && linkHref.indexOf(constantStringArray[1]) > -1)
            paginationLinks.add(linkHref);
        });
      }
      console.log("paginationLinks : ", paginationLinks);
      checkIfPertinentPaginationSelection(resolve, "noSelector", paginationLinks);
    } catch (error) {
      alert(error);
    }
  });
}

function checkIfPertinentPaginationSelection(resolve, paginationSelector, paginationLinks) {
  let paginationData;
  if (paginationLinks.size === 0) {
    alert(contentLang.UnableToFindLinksForPaginationPages);
    return false;
  } else if (paginationLinks.size === 1) {
    if (confirm(contentLang.PaginationFewElements)) {
      // on resolve
      paginationData = selectPaginationTags(paginationSelector);
      resolve(paginationData);
    } else
      return false;
  } else {
    // test de pertinence : on essaye de trouver une chaine de caractère constante dans les urls et un step pair, divisible par 5 ou égal à 1
    let constantStringAndStepInUrls = getConstantStringAndStepInUrls([...paginationLinks]);
    console.log("constantStringAndStepInUrls : ", constantStringAndStepInUrls);
    let foundConstantString = constantStringAndStepInUrls.constantString;
    let foundStep = constantStringAndStepInUrls.step;
    if ((foundConstantString !== "" && foundConstantString !== undefined) && (foundStep % 2 == 0 || foundStep % 5 == 0 || foundStep == 1)) {
      // on resolve
      paginationData = selectPaginationTags(paginationSelector);
      resolve(paginationData);
    } else {
      if (confirm(contentLang.PaginationConstantStringAndStepNotFound)) {
        // on resolve
        paginationData = selectPaginationTags(paginationSelector);
        resolve(paginationData);
      } else
        return false;
    }
  }
}

function getConstantStringAndStepInUrls(links) {
  let constantStringAndStepInUrls = {};
  // Constant string in urls
  let constantString, constantStrings = new Map(), step, pagesNumbers = new Set();
  for (let i = 0; i < links.length; i++) {
    for (let j = i + 1; j < links.length; j++) {
      let differenceBetweenLinks = parseInt(getDifferenceBetweenLinks(links[i], links[j])) || 0;
      // console.log("difference between " + links[i] + " and " + links[j] + " : ", differenceBetweenLinks);
      if (differenceBetweenLinks !== 0) {
        pagesNumbers.add(differenceBetweenLinks);
        let constantStringFound = links[j].replace(differenceBetweenLinks, "****");
        // console.log("constantStringFound = ", constantStringFound);
        if (constantStrings.has(constantStringFound))
          constantStrings.set(constantStringFound, constantStrings.get(constantStringFound)+1);
        else
          constantStrings.set(constantStringFound, 1);
      }
    }
  }
  if (constantStrings.size > 0) {
    let constantStringsSortedArray = [...constantStrings.entries()].sort((a, b) => b[1] - a[1]);
    console.log("constantStringsSortedArray : ", constantStringsSortedArray);
    constantStringAndStepInUrls.constantString = constantStringsSortedArray[0][0];
  } else {
    constantStringAndStepInUrls.constantString = "";
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
      constantStringAndStepInUrls.step = stepsSortedArray[0][0];
    }
  } else
    constantStringAndStepInUrls.step = 0;

  return constantStringAndStepInUrls;
}

// function highlightPagination(level, paginationSelector) {
//   console.log("highlightPagination : paginationSelector received = " + paginationSelector);
//   return new Promise(function(resolve, reject) {
//     let $paginationSelector;
//     try {
//       $paginationSelector = $(paginationSelector);
//       if ($paginationSelector !== undefined) {
//         let constantStringAndStep = getPaginationConstantStringAndStep("selector", paginationSelector);
//         if (constantStringAndStep.length > 0) {
//           console.log("highlightPagination : constantStringAndStep found : ", constantStringAndStep);
//           // on highlight
//           $paginationSelector.addClass("selected_pagination highlight_pagination");
//           // on resolve
//           var paginationData = {
//             "paginationSelector": paginationSelector,
//             "paginationConstantString": constantStringAndStep[0],
//             "paginationStep": constantStringAndStep[1]
//           };
//           resolve(paginationData);
//         } else
//           alert(contentLang.UnableToResolvePaginationPages);
//       } else
//         alert(contentLang.UnableToResolvePaginationPages);
//     } catch (error) {
//       alert(error);
//     }
//   });
// }

// function checkManualPagination(level, paginationData) {
//   console.log("go checking with data ", paginationData);
//   return new Promise(function(resolve, reject) {
//     try {
//       resolve("ok man");
//     } catch (error) {
//       alert(error);
//     }
//   });
// }

// function matchPaginationConstantStringAndStep(givenConstantString, givenStep) {
//   console.log("matchPaginationConstantStringAndStep : givenConstantString = " + givenConstantString + " | givenStep = " + givenStep);
//   return new Promise(function(resolve, reject) {
//     let constantStringAndStep = getPaginationConstantStringAndStep("custom", givenConstantString);
//     console.log("matchPaginationConstantStringAndStep : constantStringAndStep returned : constantStringAndStep.length = " + constantStringAndStep.length, constantStringAndStep);
//     if (constantStringAndStep.length > 0 && constantStringAndStep[0] === givenConstantString && constantStringAndStep[1] === givenStep) {
//       console.log("matchPaginationConstantStringAndStep : constantStringAndStep found : ", constantStringAndStep);
//       resolve(true);
//     } else
//       alert(contentLang.UnableToResolvePaginationPages);
//   });
// }
//
// function getPaginationConstantStringAndStep(paramType, param) {
//   console.log("getPaginationConstantStringAndStep with paramType = " + paramType + " and param = " + param);
//   let $urls;
//   let hrefs = new Set();
//   let currentPage = window.location.href;
//   let constantStringAndStep = [];
//   console.log("currentPage : " + currentPage);
//   let regex;
//   // custom : on cherche les liens contenant le constantString fourni en paramètre
//   // selector : on cherche les liens selon expression régulière : chaine de caractères suivi d'un symbole suivi d'une suite de nombres
//   if (paramType === "custom") {
//     $urls = $("a[href*='" + param + "']");
//     regex = new RegExp(param + "\\d+");
//   } else {
//     if (param.startsWith("a"))
//       $urls = $(param);
//     else
//       $urls = $(param).first().find("a");
//     console.log("urls : ", $urls);
//     regex = new RegExp("([\W][\d]+)(?!.*\d)");
//   }
//
//   $urls.each(function() {
//     let href = this.href;
//     if (href.endsWith("/"))
//       href = href.slice(0, -1);
//     if (typeof href !== 'undefined' && href !== currentPage && href !== currentPage + "#")
//       hrefs.add(href);
//   });
//   console.log("hrefs : ", hrefs);
//
//   // on cherche ce qui varie dans les hrefs : matching selon regex précédente
//   let pageVars = new Set();
//   for (let href of hrefs) {
//     let pageVar = href.match(regex);
//     if (pageVar !== null) {
//       let matcher = pageVar[0];
//       console.log("matcher : " + matcher);
//       pageVars.add(matcher);
//     }
//   }
//   console.log("pageVars : ", pageVars);
//
//   // pageVars doit faire au moins 1
//   if (pageVars.size > 0) {
//     // constantString
//     regex = new RegExp("([\d]+)(?!.*\d)");
//     let constantStrings = new Set();
//     let pageNbrs = new Set();
//     for (let pageVar of pageVars) {
//       let pageNbr = pageVar.match(regex);
//       if (pageNbr !== null) {
//         let matcher = pageNbr[0];
//         pageNbrs.add(matcher);
//         let constantString = pageVar.replace(matcher, "");
//         constantStrings.add(constantString);
//       }
//     }
//     console.log("constantStringes : ", constantStringes);
//
//     // on trie pageNbrs
//     let pageNbrsArray = [...pageNbrs];
//     pageNbrsArray.sort(function(a, b) {
//       return a - b
//     });
//     console.log("pageNbrsArray : ", pageNbrsArray);
//
//     // step
//     let steps = [];
//     if (pageNbrsArray.length > 2)
//       for (let i = 0; i < pageNbrsArray.length - 1; i++) {
//         let pageNbr = pageNbrsArray[i];
//         let pageNbrNext = pageNbrsArray[i + 1];
//         console.log("diff = " + (pageNbrNext - pageNbr));
//         steps.push(pageNbrNext - pageNbr);
//       }
//     else
//       steps.push(pageNbrsArray[0]);
//     // on trie steps
//     steps.sort(function(a, b) {
//       return a - b
//     });
//     console.log("steps : ", steps);
//
//     if (constantStringes.size === 1 && steps.length > 0)
//       constantStringAndStep.push([...constantStringes][0], parseInt(steps[0]));
//
//     console.log("constantStringAndStep : ", constantStringAndStep);
//   }
//   return constantStringAndStep;
// }

//function getCustomPaginationLinks(constantString, startNumber, endNumber, step) {
//    let invariant = getPaginationConstantString(constantString, startNumber, endNumber);
//    let paginationLinks = [];
//    for (let i = startNumber; i < endNumber + step; i += step) {
//        console.log("i= " + i);
//        constantString = constantString + i.toString();
//        let newInvariant = invariant.replace("x***x", constantString);
//        console.log("invariant : " + newInvariant);
//        paginationLinks.push(newInvariant);
//    }
//    console.log("paginationLinks : ");
//    console.log(paginationLinks);
//    return paginationLinks;
//}
//
//// 3 façons de récupérer les liens de pagination
//
//// 1 . le plus simple : page=, start-
//
//function getPaginationLinksWithPageTxt(paginationSelector) {
//    let paginationLinks = [];
//    let xHrefs = [];
//    let pageNbrs = [];
//    let pageTxts = ["page=", "start-"];
//    $(paginationSelector).first().find("a").each(function () {
//        let txt = $(this).text();
//        let href = this.href;
//        if (typeof href !== 'undefined') {
//            let currentPage = window.location.href;
//            if ($.isNumeric(txt) && !href.endsWith("/") && href !== currentPage) {
//                let isPertinentPageTxt = false;
//                let selectedPageTxt;
//                for (pageTxt of pageTxts) {
//                    if (href.indexOf(pageTxt) !== -1) {
//                        isPertinentPageTxt = true;
//                        selectedPageTxt = pageTxt;
//                        break;
//                    }
//                }
//                console.log("isPertinentPageTxt = " + isPertinentPageTxt + " | selectedPageTxt = " + selectedPageTxt);
//                if (isPertinentPageTxt) {
//                    let regex = new RegExp(selectedPageTxt + "\\d+");
//                    let pageNbr = href.match(regex);
//                    pageNbr = pageNbr[0].substring(pageNbr[0].indexOf(selectedPageTxt) + selectedPageTxt.length);
//                    let xHref = href.replace(regex, selectedPageTxt + "x***x");
//                    xHrefs.push(xHref);
//                    pageNbrs.push(pageNbr);
//                }
//            }
//        }
//    });
//    console.log("pageNbrs : ");
//    console.log(pageNbrs);
//    console.log("xHrefs : ");
//    console.log(xHrefs);
//    xHrefs = Array.from(new Set(xHrefs));
//    // si l'invariant a été trouvé = xHrefs.length = 1
//    if (xHrefs.length === 1) {
//        let intervals = [];
//        if (pageNbrs.length > 1)
//            for (let i = 0; i < pageNbrs.length - 1; i++) {
//                let pageNbr = pageNbrs[i];
//                let pageNbrNext = pageNbrs[i + 1];
//                console.log("diff = " + (pageNbrNext - pageNbr));
//                intervals.push(pageNbrNext - pageNbr);
//            }
//        else
//            intervals.push(pageNbrs[0]);
//        intervals.sort((a, b) => a - b);
//        let lastPage = pageNbrs[pageNbrs.length - 1];
//        let xHref = xHrefs[0];
//        let interval = Number(intervals[0]);
//        lastPage = Number(lastPage);
//
//        for (let i = parseInt(pageNbrs[0]); i < lastPage + 1; i += interval) {
//            let xHref2 = xHref.replace("x***x", i);
//            paginationLinks.push(xHref2);
//        }
//    }
//    for (link of paginationLinks)
//        console.log(link);
//    return paginationLinks;
//}
//
//function getPaginationLinks(paginationSelector) {
//    let paginationLinks = getPaginationLinksWithPageTxt(paginationSelector);
//    return paginationLinks;
//}


//function getPaginationLinks(paginationSelector) {
//    let paginationLinks = [];
//    // tableau des xHrefs = on remplace les nombres dans la référence du lien par x***x
//    // le but est de trouver un invariant  : adresse/nom_du_forum ou numero_du_forum ou autre chose relatif au forum/x***x => si on remplace les nombres qui signifient les pages, donc qui varient, on doit tomber sur cet invariant
//    let xHrefs = [];
//    let pageNbrs = [];
//    $(paginationSelector).first().find("a").each(function () {
//        let txt = $(this).text();
//        let href = this.href;
//        if (typeof href !== 'undefined') {
//            //            href = getCleanedHref(href);
//            let currentPage = window.location.href;
//            if ($.isNumeric(txt) && !href.endsWith("/") && href !== currentPage) {
//                let pageNbr = href.match(/[0-9]+(?!.*[0-9])/);
//                let xHref = href.replace(/[0-9]+(?!.*[0-9])/, "x***x");
//                xHrefs.push(xHref);
//                pageNbrs.push(pageNbr);
//            }
//        }
//    });
//    xHrefs = Array.from(new Set(xHrefs));
//    // si l'invariant a été trouvé = xHrefs.length = 1
//    if (xHrefs.length === 1) {
//        let intervals = [];
//        if (pageNbrs.length > 1)
//            for (let i = 0; i < pageNbrs.length - 1; i++) {
//                let pageNbr = pageNbrs[i];
//                let pageNbrNext = pageNbrs[i + 1];
//                console.log("diff = " + (pageNbrNext - pageNbr));
//                intervals.push(pageNbrNext - pageNbr);
//            }
//        else
//            intervals.push(pageNbrs[0]);
//        intervals.sort((a, b) => a - b);
//        let lastPage = pageNbrs[pageNbrs.length - 1];
//        let xHref = xHrefs[0];
//        let interval = Number(intervals[0]);
//        lastPage = Number(lastPage);
//
//        for (let i = parseInt(pageNbrs[0]); i < lastPage + 1; i += interval) {
//            let xHref2 = xHref.replace("x***x", i);
//            paginationLinks.push(xHref2);
//        }
//    }
//    return paginationLinks;
//}

//function getPaginationLinks(paginationSelector) {
//    let paginationLinks = [];
//    let hrefs = [];
//    let pageNbrs = [];
//    $(paginationSelector).first().find("a").each(function () {
//        let txt = $(this).text();
//        let href = this.href;
//        if (typeof href !== 'undefined') {
//            let currentPage = window.location.href;
//            if ($.isNumeric(txt) && !href.endsWith("/") && href !== currentPage) {
//                let pageNbr = txt;
//                hrefs.push(href);
//                pageNbrs.push(pageNbr);
//            }
//        }
//    });
//    console.log("pageNbrs : ");
//    console.log(pageNbrs);
//    console.log("hrefs : ");
//    console.log(hrefs);
//    // match des différences entre href
//    for (let i = 0; i < hrefs.length - 1; i++) {
//        let href = hrefs[i];
//        let hrefSup = hrefs[i + 1];
//        console.log("comparaison de " + href + " et " + hrefSup);
//        let dmp = new diff_match_patch();
//        let diffs = dmp.diff_main(href, hrefSup);
//        console.log("diffs = ");
//        console.log(diffs);
//        let goodDiff;
//        for (diff of diffs) {
//            const entries = Object.entries(diff);
//            for (const [key, value] of entries) {
//                if (value === 1) {
//                    goodDiff = diff;
//                    break;
//                }
//            }
//        }
//        console.log("goodDiff = ");
//        console.log(goodDiff[0] + " | " + goodDiff[1]);
//
//    }
//}
//console.log("differences : ");
//console.log(differences);
//
////    xHrefs = Array.from(new Set(xHrefs));
////    // si l'invariant a été trouvé = xHrefs.length = 1
////    if (xHrefs.length === 1) {
////        let intervals = [];
////        if (pageNbrs.length > 1)
////            for (let i = 0; i < pageNbrs.length - 1; i++) {
////                let pageNbr = pageNbrs[i];
////                let pageNbrNext = pageNbrs[i + 1];
////                console.log("diff = " + (pageNbrNext - pageNbr));
////                intervals.push(pageNbrNext - pageNbr);
////            }
////        else
////            intervals.push(pageNbrs[0]);
////        intervals.sort((a, b) => a - b);
////        let lastPage = pageNbrs[pageNbrs.length - 1];
////        let xHref = xHrefs[0];
////        let interval = Number(intervals[0]);
////        lastPage = Number(lastPage);
////
////        for (let i = parseInt(pageNbrs[0]); i < lastPage + 1; i += interval) {
////            let xHref2 = xHref.replace("x***x", i);
////            paginationLinks.push(xHref2);
////        }
////    }
//return paginationLinks;
//}

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

// function getDepthUrls(levelStructureMap) {
//   let depthUrls = [];
//   for (let [rowSelector, rowChildrenSelector] of levelStructureMap) {
//     $rowSelector = $(rowSelector);
//     let childUrl = "";
//     $rowSelector.each(function() {
//       let rowChildren = {};
//       for (rowChildSelectors of rowChildrenSelector) {
//         let rowChildSelectorArray = rowChildSelectors.split("***");
//         let rowChildTitle = rowChildSelectorArray[0];
//         let rowChildSelector = rowChildSelectorArray[1];
//         if (rowChildTitle === "url") {
//           let childUrl = $(this).find(rowChildSelector).prop("href");
//           depthUrls.push(childUrl);
//           break;
//         }
//       }
//     });
//   }
//   return depthUrls;
// }

function getPaginationLinks(pagination) {
  let paginationLinks,
    selector = pagination.selector,
    constantString = pagination.constantString,
    start = pagination.start,
    step = pagination.step,
    stop = pagination.stop;
  // By selector
  if (selector !== "noSelector")
    paginationLinks = getPaginationLinksWithSelector(selector);
  else
    paginationLinks = getPaginationLinksWithConstantString(constantString, start, step, stop);

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

function getPaginationLinksWithConstantString(constantString, start, step, stop) {
  // Stop est déterminé
  let paginationLinks = new Set();
  console.log("Create link with constantString = " + constantString + " | start = " + start + " | step = " + step + " | stop = " + stop);
  for (let i = start; i < stop + step;) {
    let paginationLink = constantString.replace("****", i);
    paginationLinks.add(paginationLink);
    i += step;
  }
  console.log("paginationLinks = ", paginationLinks);
  return [...paginationLinks];
}

// function getPaginationLinksWithConstantString(constantString, start, step, stop) {
//   let pathnameUsed = 0,
//     $urls,
//     tempPaginationLinks = new Set(),
//     paginationLinks = [],
//     pertinentLinks = [],
//     searchInUrls = "";
//   let currentUrl = new URL(window.location.href);
//   let origin = currentUrl.origin;
//   let pathname = currentUrl.pathname;
//   let search = currentUrl.search;
//   console.log("currentUrl = ", currentUrl);
//   console.log("origin = ", origin);
//   console.log("pathname = ", currentUrl.pathname);
//   console.log("search = ", currentUrl.search);
//
//   if (search !== "" || !pathname.endsWith("/")) {
//     // Variable PHP
//     let paginationVariable = constantString;
//     if (search !== "") {
//       // URL avec variable php présente
//       console.log("Search not empty");
//       let urlParams = new URLSearchParams(search);
//       if (urlParams.has(paginationVariable))
//         urlParams.delete(paginationVariable);
//       if (search.indexOf("/") === -1)
//         search = "?" + urlParams.toString() + "&" + paginationVariable + "=";
//       else // like in https://www.pieandbovril.com/forum/index.php?/forum/124-the-politics-forum/page/2/
//         search = search + paginationVariable;
//     } else if (!pathname.endsWith("/")) {
//       console.log("Pathname doesn't end with /");
//       //  URL avec variable PHP absente
//       // like in https://www.democratichub.com/forums/498/business-economy
//       search = "?" + paginationVariable + "=";
//     }
//     searchInUrls = origin + pathname + search;
//     $urls = $("a[href*=\"" + searchInUrls + "\"]");
//     if ($urls.length === 0) {
//       // on tente de récupérer des urls relatives
//       console.log("Retreive relative urls");
//       // on supprime le / au début du pathname car qui peut le plus peut le moins
//       searchInUrls = pathname.substring(1) + search;
//       pathnameUsed = 1;
//     }
//   } else { // Variable pathname
//     console.log("Search empty");
//     console.log("Retreive absolute urls");
//     searchInUrls = origin + pathname + constantString;
//     $urls = $("a[href*=\"" + searchInUrls + "\"]");
//     if ($urls.length === 0) {
//       // on tente de récupérer des urls relatives
//       console.log("Retreive relative urls");
//       // on supprime le / au début du pathname car qui peut le plus peut le moins
//       searchInUrls = pathname.substring(1) + constantString;
//       pathnameUsed = 1;
//     }
//   }
//   console.log("urls retrieved with searchInUrls = ", searchInUrls);
//
//   $urls = $("a[href*=\"" + searchInUrls + "\"]");
//   if ($urls.length > 0) {
//     $urls.each(function() {
//       tempPaginationLinks.add($(this).prop("href"));
//     });
//     console.log("tempPaginationLinks : ", [...tempPaginationLinks]);
//     if ([...tempPaginationLinks].length > 1) {
//       // pertinentLinks
//       pertinentLinks = getPertinentLinks([...tempPaginationLinks]);
//       console.log("Pertinent links found : ", pertinentLinks);
//
//       // page extension
//       let fileExtension = getFileExtension(pertinentLinks);
//
//       // Pages numbers
//       pagesNumbers = getPagesNumbers(pertinentLinks, searchInUrls, fileExtension);
//       pagesNumbers.sort(function(a, b) {
//         return a - b
//       });
//       console.log("pages number found : ", pagesNumbers);
//
//       // stop
//       stop = getStop(pagesNumbers);
//
//       if (stop !== 0) {
//         if (step === 0)
//           step = 1;
//         if (start === 0)
//           start = 2;
//         if (pathnameUsed === 1)
//           searchInUrls = origin + "/" + searchInUrls;
//         paginationLinks = createPaginationLinks(searchInUrls, start, step, stop, fileExtension);
//       } else
//         console.log("Failed to build pagination links (stop = 0)");
//     } else {
//       // 1 seul lien de reçu
//     }
//   } else
//     console.log("Failed to find some urls with " + searchInUrls);
//   return paginationLinks;
// }

// function getPertinentLinks(links) {
//   let pertinentLinks = new Set();
//   for (let i = 0; i < links.length - 1; i++) {
//     let link = links[i];
//     let linkNext = links[i + 1];
//     let differenceBetweenLinks = parseInt(getDifferenceBetweenLinks(link, linkNext)) || 0;
//     console.log("difference between " + link + " and " + linkNext + " : ", differenceBetweenLinks);
//     if (differenceBetweenLinks !== 0)
//       pertinentLinks.add(link).add(linkNext);
//   }
//   return [...pertinentLinks];
// }
//
// function getFileExtension(pertinentLinks){
//   let fileExtension = "",
//     filesExtensions = new Set();
//   for (pertinentLink of pertinentLinks){
//     if (pertinentLink.endsWith("html"))
//       filesExtensions.add(".html");
//     else if (pertinentLink.endsWith("htm"))
//       filesExtensions.add(".htm");
//   }
//   if ([...filesExtensions].length === 1)
//     fileExtension = [...filesExtensions][0];
//   console.log("fileExtension found : ", fileExtension);
//   return fileExtension;
// }
//
// function getPagesNumbers(pertinentLinks, constantString, fileExtension) {
//   let pagesNumbers = new Set();
//   // 1er passage avec différence entre liens
//   console.log("1er passage avec différences entre liens");
//   for (let i = 0; i < pertinentLinks.length - 1; i++) {
//     let pertinentLink = pertinentLinks[i];
//     let pertinentLinkNext = pertinentLinks[i + 1];
//     let differenceBetweenPertinentLinks = parseInt(getDifferenceBetweenLinks(pertinentLink, pertinentLinkNext)) || 0;
//     console.log("difference between " + pertinentLink + " and " + pertinentLinkNext + " : ", differenceBetweenPertinentLinks);
//     if (differenceBetweenPertinentLinks !== 0)
//       pagesNumbers.add(differenceBetweenPertinentLinks);
//   }
//   // 2ème passage avec constantString
//   console.log("2ème passage de getPagesNumbers avec constantString : ", constantString)
//   if (constantString !== "") {
//     for (pertinentLink of pertinentLinks) {
//       if (fileExtension !== "")
//         pertinentLink = pertinentLink.replace(fileExtension, "");
//       if (pertinentLink.indexOf(constantString) !== -1) {
//         let constantStringPosition = pertinentLink.indexOf(constantString);
//         let constantStringLength = constantString.length;
//         let pageNumber = pertinentLink.substring(constantStringPosition + constantStringLength);
//         console.log("constantStringPosition : ", constantStringPosition, "\nconstantStringLength : ", constantStringLength, "\npageNumber : ", pageNumber);
//         pageNumber = parseInt(pageNumber.replace(/^\D+/g, ""));
//         if (!isNaN(pageNumber) && pageNumber > 0)
//           pagesNumbers.add(pageNumber);
//       }
//     }
//   }
//   return [...pagesNumbers];
// }
//
// function getStart(pagesNumbers) {
//   let start = 0;
//   if (pagesNumbers.length > 0)
//     if (pagesNumbers.length > 1)
//       start = pagesNumbers[0];
//     else
//       start = 2;
//   else
//     start = 2
//   return start;
// }
//
// function getStop(pagesNumbers) {
//   let stop = 0;
//   if (pagesNumbers.length > 0)
//     if (pagesNumbers.length > 1)
//       stop = pagesNumbers[pagesNumbers.length - 1];
//     else
//       stop = pageNbrsArray[0];
//   else
//     stop = 0;
//   return stop;
// }
//
// function getSteps(pagesNumbers) {
//   let steps = new Set();
//   if (pagesNumbers.length > 1)
//     for (let i = 0; i < pagesNumbers.length - 1; i++) {
//       let pageNbr = pagesNumbers[i];
//       let pageNbrNext = pagesNumbers[i + 1];
//       steps.add(pageNbrNext - pageNbr);
//     }
//   else
//     steps.add(pageNbrsArray[0]);
//   return [...steps];
// }
//
// function getConstantString(pertinentLinks) {
//   let constantString = "";
//   var A = pertinentLinks.concat().sort(),
//     a1 = A[0],
//     a2 = A[A.length - 1],
//     L = a1.length,
//     i = 0;
//   while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
//   constantString = a1.substring(0, i);
//   return constantString;
// }
//
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

// function createPaginationLinks(constantString, start, step, stop, fileExtension) {
//   let paginationLinks = new Set();
//   console.log("Create link with constantString = " + constantString + " | start = " + start + " | step = " + step + " | stop = " + stop + " | fileExtension = " + fileExtension);
//   for (let i = start; i < stop + 1;) {
//     let paginationLink = constantString + i;
//     if (fileExtension !== "")
//       paginationLink += fileExtension;
//     console.log("paginationLink = ", paginationLink);
//     paginationLinks.add(paginationLink);
//     i += step;
//   }
//   return [...paginationLinks];
// }

// function getPaginationUrlsVariables(links) {
//   let paginationUrlsVariables = {},
//     constantString = "",
//     start = 0,
//     stop = 0,
//     steps = [],
//     pagesNumbers = [],
//     pertinentLinks = [],
//     fileExtension;
//   // pertinentLinks
//   pertinentLinks = getPertinentLinks(links);
//   console.log("Pertinent links found : ", pertinentLinks);
//
//   // fileExtension
//   fileExtension = getFileExtension(pertinentLinks);
//   console.log("fileExtension found : ", fileExtension);
//   paginationUrlsVariables.fileExtension = fileExtension;
//
//   // constantString
//   constantString = getConstantString(pertinentLinks);
//   console.log("constantString found : ", constantString);
//   paginationUrlsVariables.constantString = constantString;
//
//   // Pages numbers
//   pagesNumbers = getPagesNumbers(pertinentLinks, constantString, "");
//   pagesNumbers.sort(function(a, b) {
//     return a - b
//   });
//   console.log("pages number found : ", pagesNumbers);
//
//   // start & stop
//   start = getStart(pagesNumbers);
//   stop = getStop(pagesNumbers);
//   console.log("start found : ", start, "\nstop found : ", stop);
//   paginationUrlsVariables.start = start;
//   paginationUrlsVariables.stop = stop;
//
//   // steps
//   steps = getSteps(pagesNumbers);
//   console.log("steps found : ", steps);
//   paginationUrlsVariables.steps = steps;
//
//   return paginationUrlsVariables;
// }

// function getPaginationLinks(pagination) {
//   let paginationLinks = new Set();
//   let hrefs = new Set();
//   let constantString = pagination.constantString;
//   let currentPage = window.location.href;
//   let $urls;
//   let paginationSelector = pagination.selector;
//   if (paginationSelector !== "custom pagination") {
//     let $paginationSelector = $(paginationSelector).first();
//     //        if ()
//     $urls = $paginationSelector.find("a[href*='" + constantString + "']");
//   } else {
//     $urls = $(document).find("a[href*='" + constantString + "']");
//   }
//   $urls.each(function() {
//     let href = this.href;
//     if (typeof href !== 'undefined' && !href.endsWith("/") && href !== currentPage && href !== currentPage + "#")
//       hrefs.add(href);
//   });
//   console.log("hrefs : ", hrefs);
//
//   let regex = new RegExp(constantString + "\\d+");
//   let xHrefs = new Set();
//   let pageNbrs = new Set();
//   for (let href of hrefs) {
//     let xHref = href.replace(regex, "x***x");
//     xHrefs.add(xHref);
//     let constantStringAndPageNbr = href.match(regex);
//     if (constantStringAndPageNbr !== null) {
//       let matcher = constantStringAndPageNbr[0];
//       let pageNbr = matcher.match("\\d+");
//       if (pageNbr !== null) {
//         matcher = pageNbr[0];
//         pageNbrs.add(matcher);
//       }
//     }
//   }
//   console.log("xHrefs : ", xHrefs);
//   console.log("pageNbrs : ", pageNbrs);
//
//   if (xHrefs.size === 1 && pageNbrs.size > 0) {
//     let invariantUrl = [...xHrefs][0];
//     let pageNbrsArray = [...pageNbrs];
//     pageNbrsArray.sort(function(a, b) {
//       return a - b
//     });
//     let lastPage = pageNbrsArray[pageNbrsArray.length - 1];
//     lastPage = Number(lastPage);
//     let step = pagination.step;
//     for (let i = step; i < lastPage + step; i += step) {
//       console.log("i= " + i);
//       let newConstantString = constantString + i;
//       console.log("newConstantString : " + newConstantString);
//       let link = invariantUrl.replace("x***x", newConstantString);
//       console.log("link : " + link);
//       paginationLinks.add(link);
//     }
//     console.log("paginationLinks : ", paginationLinks);
//   }
//   return [...paginationLinks];
// }
