// dynamic css
function colorGen() {
    var generateColor = Math.floor(Math.random() * 256);
    return generateColor;
}

function injectRowsStyles() {
    if (!getColsDepthsStyles()) {
        var css = "";
        for (var i = 0; i < 100; i++) {
            // row
            var rowColor = "hsl(" + 360 * Math.random() + ',' +
                (25 + 70 * Math.random()) + '%,' +
                (85 + 10 * Math.random()) + '%)';
            var rowColors = ".highlight_row-" + i + " { box-shadow: 0 0 3px #000; background: white; background-color: " + rowColor + " !important; }\n";
            css += rowColors;
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.title = 'content-rows-dynamic-css';
        style.appendChild(document.createTextNode(css));
        console.log("row styles injectés");
    } else {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.title == "content-cols-depths-dynamic-css") {
                for (var i = 0; i < 100; i++) {
                    // col-depth
                    for (var i = 0; i < 100; i++) {
                        // row
                        var rowColor = "hsl(" + 360 * Math.random() + ',' +
                            (25 + 70 * Math.random()) + '%,' +
                            (85 + 10 * Math.random()) + '%)';
                        var rowColors = ".highlight_row-" + i + " { box-shadow: 0 0 3px #000; background: white; background-color: " + rowColor + " !important; }\n";
                        sheet.insertRule(rowColors, sheet.cssRules.length);
                    }
                }
                break;
            }
        }
    }
}

function injectColsDepthsStyles() {
    if (!getRowsStyles()) {
        var css = "";
        for (var i = 0; i < 100; i++) {
            // col-depth
            for (var j = 0; j < 100; j++) {
                var colDepthColors = ".highlight_col-" + i + ".highlight_depth-" + j + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(coral,#77dd77) !important; }\n";
                css += colDepthColors;
            }
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.title = 'content-cols-depths-dynamic-css';
        style.appendChild(document.createTextNode(css));
        console.log("nouvelle balise style : cols depths styles injectés");
    } else {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.title == "content-rows-dynamic-css") {
                for (var i = 0; i < 100; i++) {
                    // col-depth
                    for (var j = 0; j < 100; j++) {
                        var colDepthColors = ".highlight_col-" + i + ".highlight_depth-" + j + " { box-shadow: 0 0 3px #000; background: white; background: linear-gradient(coral,#77dd77) !important; }\n";
                        sheet.insertRule(colDepthColors, sheet.cssRules.length);
                    }
                }
                break;
            }
        }
    }
}

function highlightContent(level) {
    // pagination
    let pagination = level.pagination;
    if (pagination !== null) {
        let paginationTagClass = pagination.tagClass;
        // On créé un élément jquery selon la classe
        $(paginationTagClass).addClass("selected_pagination highlight_pagination");
    }
    // rows
    let rows = level.rows;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        console.log("row à highlighter : ");
        console.log(row);
        let $rowTagClass = $(row.tagClass);
        $rowTagClass.each(function () {
            $this = $(this);
            $this.addClass("selected_row highlight_row-" + row.id);
            // on le colorie selon row color
            $this.css("background-color", row.color);
            // col
            let cols = row.cols;
            for (let j = 0; j < cols.length; j++) {
                let col = cols[j];
                let colTagClass = col.tagClass;
                let $selected_col = $this.find(colTagClass).filter(":first");
                if ($selected_col)
                    $selected_col.addClass("selected_col highlight_col-" + col.id);                    
            }
            // depth
            let depth = row.depth;
            if (depth !== null) {
                let depthTagClass = depth.tagClass;
                let $selected_depth = $this.find(depthTagClass).filter(":first");
                if ($selected_depth)
                    $selected_depth.addClass("selected_depth highlight_depth-" + row.id);                    
            }
        });
    }
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

function selectRows(rowId) {
    var targetRow;
    return new Promise(function (resolve, reject) {
        // on écoute le mouseover, le mouseout et le click sur les enfants du tag <body>
        $('body').children().on({
            mouseover: function (event) {
                // on récupère la cible survolée
                targetRow = $(event.target);
                var targetRowTagName = targetRow.prop("tagName");
                // si la cible est différente de pertinentRowTags, on récupère un parent plus pertinent
                if (pertinentRowTags.indexOf(targetRowTagName) === -1)
                    targetRow = getClosestPertinentParentRowTag(targetRow);
                // si la cible survolée n'a pas de classe selected-row ...
                if (!targetRow.hasClass("selected_row"))
                    targetRow.addClass("highlight_row-" + rowId);
                return false;
            },
            mouseout: function (event) {
                if (typeof targetRow !== 'undefined' && !targetRow.hasClass("selected_row"))
                    targetRow.removeClass("highlight_row-" + rowId);
                return false;
            },
            click: function (event) {
                event.preventDefault();
                // Première chose : on enlève le highlight qui vient d'être fait
                targetRow.removeClass("highlight_row-" + rowId);
                // D'abord on teste si tag correspond a un des pertinents row tags
                var targetRowTagName = targetRow.prop("tagName");
                if (targetRowTagName === undefined)
                    alert("Balise de sélection non prise en charge (!= <LI>, <TR>) ou <DIV>");
                else if (targetRowTagName !== "LI" && targetRowTagName !== "TR" && targetRowTagName !== "DIV")
                    alert("Balise de sélection non prise en charge (!= <LI>, <TR>) ou <DIV>");
                else if (!targetRow.attr('class'))
                    alert("Ligne impossible à sélectionner (Classe vide)");
                else if (targetRow.hasClass("selected_row"))
                    alert("Ligne déjà sélectionnée");
                else {
                    // on split les classes de la balise
                    var rowClasses = targetRow.attr("class").split(" ");
                    // On construit la structure de classes : .class.class.class ...
                    var rowClassName = "." + rowClasses.join(".");
                    console.log("row class name = " + rowClassName);
                    // On créé un élément jquery selon la structure de classe identifiée
                    var $sameTags = $(rowClassName);
                    if ($sameTags.length > 1) {
                        // on les surligne
                        $sameTags.addClass("selected_row highlight_row-" + rowId);
                        // on récupère la couleur
                        var rowColor = $sameTags.first().css("background-color");
                        // on resolve
                        var dataArray = {
                            "rowTagClass": targetRowTagName + rowClassName,
                            "rowColor": rowColor
                        };
                        resolve(dataArray);
                        // on enlève les actions
                        $('body').children().unbind();
                    } else
                        alert("Ligne impossible à sélectionner : trop peu d'éléments identiques");
                }
                return false;
            }
        });
    });
}

function removeHighlightedElement(element) {
    var targetClass, classToRemove;
    if (element.dataType != 'pagination') {
        targetClass = ".highlight_" + element.dataType + "-" + element.id;
        console.log("targetClass = " + targetClass);
        classToRemove = "selected_" + element.dataType + " highlight_" + element.dataType + "-" + element.id;
    } else {
        targetClass = ".highlight_pagination";
        console.log("targetClass = " + targetClass);
        classToRemove = "selected_pagination highlight_pagination";
    }
    console.log("classToRemove = " + classToRemove);
    $(targetClass).removeClass(classToRemove);
    $(targetClass).children().removeClass(classToRemove);
}

// Sélection de colonne

// Fonction qui vérifie si l'élément (colonne ou depth) survolé appartient à une ligne sélectionnée

function hasSelectedParentRow(element, row) {
    var hasSelectedParentRow = false;
    var rowTagClass = row.tagClass;
    if (element.parents(rowTagClass).length)
        hasSelectedParentRow = true;
    return hasSelectedParentRow;
}



function selectCols(row, colId) {
    return new Promise(function (resolve, reject) {
        var targetCol;
        $('body').children().on({
            mouseover: function (event) {
                // on récupère la cible survolée
                targetCol = $(event.target);
                // si la cible fait partie d'une ligne sélectionnée : on la colorie
                if (hasSelectedParentRow(targetCol, row))
                    targetCol.addClass("highlight_col-" + colId);
                return false;
            },
            mouseout: function (event) {
                if (typeof targetCol !== 'undefined' && !targetCol.hasClass("selected_col"))
                    targetCol.removeClass("highlight_col-" + colId);
            },
            click: function (event) {
                event.preventDefault();
                // on efface le highlight qui vient d'être fait
                targetCol.removeClass("highlight_col-" + colId);
                if (!targetCol.attr('class'))
                    alert("Impossible de sélectionner cette colonne (Classe vide)");
                else if (targetCol.hasClass("selected_col"))
                    alert("Colonne déjà sélectionnée");
                else if (!hasSelectedParentRow(targetCol, row))
                    alert("Cette colonne n'appartient pas à une ligne sélectionnée");
                else {
                    var hasDepth = false;
                    // on check si depth ou pas
                    if (targetCol.hasClass("selected_depth")) {
                        hasDepth = true;
                        targetCol.removeClass("selected_depth highlight_depth-" + row.id);
                    }
                    var colTagName = targetCol.prop("tagName");
                    // On construit la structure qui désignera la classe des tags identiques
                    var targetColClasses = targetCol.attr("class").split(" ");
                    var colClassName = "." + targetColClasses.join(".");
                    console.log("targetCol finale : tag = " + colTagName + " | className = " + colClassName + " | hasDepth = " + hasDepth);

                    // On créé un élément jquery selon la structure identifiée
                    var $sameTags = $(colClassName);
                    if ($sameTags.length > 1) {
                        $(row.tagClass).each(function () {
                            $selected_col = $(this).find(colTagName + colClassName).filter(":first");
                            $selected_col.addClass("selected_col highlight_col-" + colId);
                            if (hasDepth)
                                $selected_col.addClass("selected_depth highlight_depth-" + row.id);
                        });
                        // on resolve
                        var dataArray = {
                            "colTagClass": colTagName + colClassName,
                            "sameTagsLenght": $sameTags.length
                        };
                        resolve(dataArray);
                        // on enlève les actions
                        $('body').children().unbind();
                    } else
                        alert("Colonne impossible à sélectionner : trop peu d'éléments identiques");


                }
                return false;
            }
        });
    });
}

// Sélection de profondeur

function getCleanedHref(href) {
    var href = href;
    if (href.startsWith("./"))
        href = href.substr(1);
    if (!href.startsWith("http://") && !href.startsWith("https://")) {
        if (!href.startsWith("/"))
            href = "/" + href;
        var protocol = location.protocol;
        var hostname = location.hostname;
        var pathname = location.pathname;
        pathname = pathname.substring(0, pathname.lastIndexOf("/"));
        href = protocol + '//' + hostname + pathname + href;
    }
    return href;
}

function selectDepth(row) {
    return new Promise(function (resolve, reject) {
        var targetDepth;
        $('body').children().on({
            mouseover: function (event) {
                // on récupère la cible survolée
                targetDepth = $(event.target);
                // si la cible fait partie d'une ligne sélectionnée et est une balise <a> : on la colorie
                if (hasSelectedParentRow(targetDepth, row) && targetDepth.prop("tagName") == "A")
                    targetDepth.addClass("highlight_depth-" + row.id);
                return false;
            },
            mouseout: function (event) {
                if (typeof targetDepth !== 'undefined' && !targetDepth.hasClass("selected_depth"))
                    targetDepth.removeClass("highlight_depth-" + row.id);
            },
            click: function (event) {
                event.preventDefault();
                // on efface le highlight qui vient d'être fait
                targetDepth.removeClass("highlight_depth-" + row.id);
                // on récupère le tagName original
                var targetDepthTagName = targetDepth.prop("tagName");
                if (targetDepthTagName !== "A")
                    alert("Sélection invalide. Vous devez sélectionner un lien.");
                else if (!targetDepth.attr('class'))
                    alert("Impossible de sélectionner cette profondeur (Classe vide)");
                else if (targetDepth.hasClass("selected_depth"))
                    alert("Sélection invalide. Profondeur déjà sélectionnée");
                else if (!hasSelectedParentRow(targetDepth, row))
                    alert("Sélection invalide. Le lien sélectionné n'appartient pas à une ligne sélectionnée");
                else {
                    // on check si col ou pas
                    // on a besoin de retrouver l'id col pour supprimer highlight_col-colId
                    var hasCol = false;
                    var colId;
                    if (targetDepth.hasClass("selected_col")) {
                        hasCol = true;
                        var colClasses = targetDepth.attr("class").split(" ");
                        for (var i = 0; i < colClasses.length; i++) {
                            var colClassName = colClasses[i];
                            if (colClassName.indexOf("highlight_col-") !== -1) {
                                colId = colClassName.substr(colClassName.indexOf("highlight_col-") + 14);
                                break;
                            }
                        }
                    }
                    if (hasCol)
                        targetDepth.removeClass("selected_col highlight_col-" + colId);

                    // On construit la structure qui désignera la classe des tags identiques
                    var targetDepthClasses = targetDepth.attr("class");
                    var depthClasses = targetDepthClasses.split(" ");
                    var depthClassName = "." + depthClasses.join(".");
                    console.log("targetDepth finale : tag : " + targetDepthTagName + " | class : " + depthClassName + " | hasCol ? " + hasCol + " | colId : " + colId)

                    // On créé un élément jquery selon la structure identifiée
                    var $sameTags = $(depthClassName);
                    var deeperLinks = [];
                    // On créé un élément jquery selon la structure identifiée
                    var $sameTags = $(depthClassName);
                    if ($sameTags.length > 1) {
                        $(row.tagClass).each(function () {
                            $selected_depth = $(this).find(targetDepthTagName + depthClassName).filter(":first");
                            $selected_depth.addClass("selected_depth highlight_depth-" + row.id);
                            if (hasCol)
                                $selected_depth.addClass("selected_col highlight_col-" + colId);
                            var $thisText = $selected_depth.text();
                            // test sur le texte : doit être différent d'un nombre
                            if (!$.isNumeric($thisText)) {
                                var href = $selected_depth.prop("href");
                                deeperLinks.push(href);
                            }
                        });
                        // on resolve
                        var dataArray = {
                            "depthTagClass": targetDepthTagName + depthClassName,
                            "deeperLinks": deeperLinks
                        };
                        resolve(dataArray);
                        // on enlève les actions
                        $('body').children().unbind();
                    } else
                        alert("Profondeur impossible à sélectionner : trop peu d'éléments identiques");
                }
                return false;
            }
        });
    });
}

// sélection de pagination

function getCleanedPaginationClass(targetElement) {
    var targetElementClassName = targetElement.attr("class");
    if (targetElementClassName.length === 0) {
        var newTargetElement = targetElement.parent('[class]');
        var newTargetElementClassName = newTargetElement.attr("class");

        if (typeof newTargetElementClassName === 'undefined' || newTargetElementClassName.length === 0)
            return null;
        else
            return getCleanedPaginationClass(newTargetElement);
    } else
        return targetElement;
}

function sortNumber(a, b) {
    return a - b;
}

function selectPagination() {
    return new Promise(function (resolve, reject) {
        var targetPagination;
        $('body').children().bind({
            mouseover: function (event) {
                targetPagination = $(event.target);
                targetPagination.addClass("highlight_pagination");
                return false;
            },
            mouseout: function (event) {
                if (typeof targetPagination !== 'undefined' && !targetPagination.hasClass("selected_pagination"))
                    targetPagination.removeClass("highlight_pagination");
            },
            click: function (event) {
                event.preventDefault();
                // on efface le highlight sur la cible
                targetPagination.removeClass("highlight_pagination");
                if (!targetPagination.attr('class'))
                    alert("Impossible de sélectionner cette pagination (Classe vide)");
                else {
                    var paginationTagName = targetPagination.prop("tagName");

                    var paginationClasses = targetPagination.attr("class").split(" ");
                    var paginationClassName = "." + paginationClasses.join(".");
                    var paginationTagClass = paginationTagName + paginationClassName;
                    let paginationLinks = getPaginationLinks(paginationTagClass);
                    if (paginationLinks.length > 0) {
                        // on highlight
                        targetPagination.addClass("selected_pagination highlight_pagination");
                        // on resolve
                        var dataArray = {
                            "paginationTagClass": paginationTagClass
                        };
                        resolve(dataArray);
                    } else
                        alert("Impossible de résoudre l'adresse des pages de pagination");
                    // on enlève les actions
                    $('body').children().unbind();
                }
                return false;
            }
        });
    });
}

function getScrappedLevel(levelStructureMap, rowNbr) {
    console.log("levelStructureMap : ");
    console.log(levelStructureMap);
    let map = new Map();
    for (let [rowTagClass, rowChildrenTagClass] of levelStructureMap) {
        console.log("rowTagClass : " + rowTagClass);
        $rowTagClass = $(rowTagClass);
        console.log("$rowTagClass lenght: " + $rowTagClass.length);
        let childUrl = "";
        $rowTagClass.each(function () {
            let rowChildren = {};
            for (rowChildTagClasses of rowChildrenTagClass) {
                let rowChildTagClassArray = rowChildTagClasses.split("***");
                let rowChildTitle = rowChildTagClassArray[0];
                let rowChildTagClass = rowChildTagClassArray[1];
                let childText = $(this).find(rowChildTagClass).filter(":first").text();
                if (childText !== null && childText !== undefined) {
                    if (rowChildTitle === "url") {
                        childText = $(this).find(rowChildTagClass).prop("href");
                        childUrl = childText;
                    } else {
                        childUrl = rowNbr;
                    }
                    rowChildren[rowChildTitle] = childText;
//                    console.log("rowNbr = " + rowNbr + " | rowChildTitle = " + rowChildTitle + " | rowChildTagClass = " + rowChildTagClass + " | childText = " + childText.length + " | rowChildren = " + Object.keys(rowChildren).length);
                }
            }
            rowNbr++;
            if (Object.keys(rowChildren).length > 0)
                map.set(childUrl, rowChildren);
        });
    }
    return map;
}

function getPaginationLinks(paginationTagClass) {
    let paginationLinks = [];

    // tableau des xHrefs = on remplace les nombres dans la référence du lien par x***x
    // le but est de trouver un invariant  : adresse/nom_du_forum ou numero_du_forum ou autre chose relatif au forum/x***x => si on remplace les nombres qui signifient les pages, donc qui varient, on doit tomber sur cet invariant
    let xHrefs = [];
    let pageNbrs = [];
    console.log("liens de pagination trouvés = " + $(paginationTagClass).first().find("a").length);
    $(paginationTagClass).first().find("a").each(function () {
        let txt = $(this).text();
        let href = this.href;
        console.log("href = " + href);
        if (typeof href !== 'undefined') {
            //            href = getCleanedHref(href);
            if ($.isNumeric(txt) && !href.endsWith("/")) {
                let pageNbr = href.match(/[0-9]+(?!.*[0-9])/);
                let xHref = href.replace(/[0-9]+(?!.*[0-9])/, "x***x");
                xHrefs.push(xHref);
                pageNbrs.push(pageNbr);
            }
        }
    });
    console.log("pageNbrs : " + pageNbrs);
    xHrefs = Array.from(new Set(xHrefs));
    console.log("xHrefs final : length = " + xHrefs.length + " | " + xHrefs);
    // si l'invariant a été trouvé = xHrefs.length = 1
    if (xHrefs.length === 1) {
        let intervals = [];
        if (pageNbrs.length > 1)
            for (let i = 0; i < pageNbrs.length - 1; i++) {
                let pageNbr = pageNbrs[i];
                let pageNbrNext = pageNbrs[i + 1];
                console.log("diff = " + (pageNbrNext - pageNbr));
                intervals.push(pageNbrNext - pageNbr);
            }
        else
            intervals.push(pageNbrs[0]);
        intervals.sort(sortNumber);
        console.log("intervals : " + intervals);
        let lastPage = pageNbrs[pageNbrs.length - 1];
        let xHref = xHrefs[0];
        let interval = Number(intervals[0]);
        lastPage = Number(lastPage);
        console.log("le plus petit intervalle est de : " + interval + " | last page = " + lastPage + " | xhref = " + xHref);

        for (let i = 0; i < lastPage + 1; i += interval) {
            let xHref2 = xHref.replace("x***x", i);
            paginationLinks.push(xHref2);
        }
    }
    console.log("paginationLinks : ");
    console.log(paginationLinks);
    return paginationLinks;
}
