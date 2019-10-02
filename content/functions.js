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
        let $paginationTagClass = $(pagination.tagClass).first;
        // On créé un élément jquery selon la classe
        $paginationTagClass.addClass("selected_pagination highlight_pagination");
    }
    // rows
    let rows = level.rows;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let $rowTagClass = $(row.tagClass);
        $rowTagClass.each(function () {
            $this = $(this);
            $this.addClass("selected_row highlight_row-" + row.id);
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

function stopContentSelect(level) {
    return new Promise(function (resolve, reject) {
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

                var targetRowTagName = targetRow.prop("tagName");
                //                if (targetRowTagName === undefined)
                //                    alert(contentLang.SelectionTagNotSupported);
                //                else 
                if (targetRowTagName !== "LI" && targetRowTagName !== "TR" && targetRowTagName !== "DIV")
                    alert(contentLang.SelectionTagNotSupported);
                else if (!targetRow.attr('class'))
                    alert(contentLang.RowEmptyClass);
                else if (targetRow.hasClass("selected_row"))
                    alert(contentLang.RowAlreadySelected);
                else {
                    // on split les classes de la balise
                    var rowClasses = targetRow.attr("class").split(" ");
                    // On construit la structure de classes : .class.class.class ...
                    var rowClassName = "." + rowClasses.join(".");
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
                    } else {
                        alert(contentLang.RowTooFewElements);
                    }
                }
                return false;
            }
        });
    });
}

function highlightRows(rowTagClass, rowId) {
    return new Promise(function (resolve, reject) {
        let $rowTagClass;
        try {
            $rowTagClass = $(rowTagClass);
            if ($rowTagClass !== undefined) {
                // on les surligne
                $rowTagClass.addClass("selected_row highlight_row-" + rowId);
                // on récupère la couleur
                var rowColor = $(".highlight_row-" + rowId).first().css("background-color");
                console.log("rowColor = " + rowColor);
                // on resolve
                var dataArray = {
                    "rowTagClass": rowTagClass,
                    "rowColor": rowColor
                };
                resolve(dataArray);
            } else {
                alert(contentLang.RowTooFewElements);
            }
        } catch (error) {
            alert(error);
        }
    });
}



function removeHighlightedElement(element) {
    var targetClass, classToRemove;
    if (element.dataType != 'pagination') {
        targetClass = ".highlight_" + element.dataType + "-" + element.id;
        classToRemove = "selected_" + element.dataType + " highlight_" + element.dataType + "-" + element.id;
    } else {
        targetClass = ".highlight_pagination";
        classToRemove = "selected_pagination highlight_pagination";
    }
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
                    alert(contentLang.ColEmptyClass);
                else if (targetCol.hasClass("selected_col"))
                    alert(contentLang.ColAlreadySelected);
                else if (!hasSelectedParentRow(targetCol, row))
                    alert(contentLang.ColNotRowChild);
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
                            "colTagClass": colTagName + colClassName
                        };
                        resolve(dataArray);
                        // on enlève les actions
                        $('body').children().unbind();
                    } else
                        alert(contentLang.ColTooFewElements);
                }
                return false;
            }
        });
    });
}

function highlightCols(row, colTagClass, colId) {
    return new Promise(function (resolve, reject) {
        let $colTagClass;
        try {
            $colTagClass = $(colTagClass);
            if ($colTagClass !== undefined) {
                $(row.tagClass).each(function () {
                    $selected_col = $(this).find(colTagClass).filter(":first");
                    $selected_col.addClass("selected_col highlight_col-" + colId);
                });
                // on resolve
                var dataArray = {
                    "colTagClass": colTagClass
                };
                resolve(dataArray);
            } else
                alert(contentLang.ColTooFewElements);
        } catch (error) {
            alert(error);
        }
    });
}

// Sélection de profondeur

//function getCleanedHref(href) {
//    var href = href;
//    if (href.startsWith("./"))
//        href = href.substr(1);
//    if (!href.startsWith("http://") && !href.startsWith("https://")) {
//        if (!href.startsWith("/"))
//            href = "/" + href;
//        var protocol = location.protocol;
//        var hostname = location.hostname;
//        var pathname = location.pathname;
//        pathname = pathname.substring(0, pathname.lastIndexOf("/"));
//        href = protocol + '//' + hostname + pathname + href;
//    }
//    return href;
//}

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
                    alert(contentLang.InvalidSelectionLink);
                else if (!targetDepth.attr('class'))
                    alert(contentLang.DepthEmptyClass);
                else if (targetDepth.hasClass("selected_depth"))
                    alert(contentLang.DepthAlreadySelected);
                else if (!hasSelectedParentRow(targetDepth, row))
                    alert(contentLang.LinkNotRowChild);
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
                                if (href !== null)
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
                        alert(contentLang.DepthTooFewElements);
                }
                return false;
            }
        });
    });
}

function highlightDepth(row, depthTagClass) {
    return new Promise(function (resolve, reject) {
        let $depthTagClass;
        try {
            $depthTagClass = $(depthTagClass);
            if ($depthTagClass !== undefined) {
                let deeperLinks = [];
                let depthTagName = $depthTagClass.prop("tagName");
                if (depthTagName === "A") {
                    $(row.tagClass).each(function () {
                        $selected_depth = $(this).find(depthTagClass).filter(":first");
                        $selected_depth.addClass("selected_depth highlight_depth-" + row.id);
                        var $thisText = $selected_depth.text();
                        // test sur le texte : doit être différent d'un nombre
                        if (!$.isNumeric($thisText)) {
                            var href = $selected_depth.prop("href");
                            deeperLinks.push(href);
                        }
                    });
                    // on resolve
                    var dataArray = {
                        "depthTagClass": depthTagClass,
                        "deeperLinks": deeperLinks
                    };
                    resolve(dataArray);
                } else
                    alert(contentLang.InvalidSelectionLink);
            } else
                alert(contentLang.DepthTooFewElements);
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
                    alert(contentLang.PaginationEmptyClass);
                else if (targetPagination.hasClass("selected_pagination"))
                    alert(contentLang.PaginationAlreadySelected);
                else {
                    var paginationTagName = targetPagination.prop("tagName");
                    var paginationClasses = targetPagination.attr("class").split(" ");
                    var paginationClassName = "." + paginationClasses.join(".");
                    var paginationTagClass = paginationTagName + paginationClassName;
                    let prefixAndStep = getPaginationPrefixAndStep("tagClass", paginationTagClass);
                    if (prefixAndStep.length > 0) {
                        //                                alert("prefix found : " + prefixAndStep[0] + " | step found : " + prefixAndStep[1]);                                
                        // on highlight
                        targetPagination.addClass("selected_pagination highlight_pagination");
                        // on resolve
                        var dataArray = {
                            "paginationTagClass": paginationTagClass,
                            "paginationPrefix": prefixAndStep[0],
                            "paginationStep": prefixAndStep[1]
                        };
                        resolve(dataArray);
                        // on enlève les actions
                        $('body').children().unbind();
                    } else
                        alert(contentLang.UnableToResolvePaginationPages);
                }
                return false;
            }
        });
    });
}

function highlightPagination(level, paginationTagClass) {
    return new Promise(function (resolve, reject) {
        let $paginationTagClass;
        try {
            $paginationTagClass = $(paginationTagClass);
            if ($paginationTagClass !== undefined) {
                let prefixAndStep = getPaginationPrefixAndStep("tagClass", paginationTagClass);
                if (prefixAndStep.length > 0) {
                    //            alert("prefix found : " + prefixAndStep[0] + " | step found : " + prefixAndStep[1]);
                    // on highlight
                    $paginationTagClass.addClass("selected_pagination highlight_pagination");
                    // on resolve
                    var dataArray = {
                        "paginationTagClass": paginationTagClass,
                        "paginationPrefix": prefixAndStep[0],
                        "paginationStep": prefixAndStep[1]
                    };
                    resolve(dataArray);
                } else
                    alert(contentLang.UnableToResolvePaginationPages);
            } else
                alert(contentLang.UnableToResolvePaginationPages);
        } catch (error) {
            alert(error);
        }
    });
}

function matchPaginationPrefixAndStep(givenPrefix, givenStep) {
    return new Promise(function (resolve, reject) {
        let prefixAndStep = getPaginationPrefixAndStep("custom", givenPrefix);
        if (prefixAndStep.length > 0 && prefixAndStep[0] === givenPrefix && prefixAndStep[1] === givenStep) {
            //            alert("prefix matching : " + prefixAndStep[0] + " | step matching : " + prefixAndStep[1]);
            resolve(true);
        } else
            alert(contentLang.UnableToResolvePaginationPages);
    });
}

function getPaginationPrefixAndStep(paramType, param) {
    let $urls;
    let hrefs = new Set();
    let currentPage = window.location.href;
    let prefixAndStep = [];
    console.log("currentPage : " + currentPage);
    let regex;
    // custom : on cherche les liens contenant le prefix fourni en paramètre
    // tagClass : on cherche les liens selon expression régulière : chaine de caractères suivi d'un symbole suivi d'une suite de nombres
    if (paramType === "custom") {
        $urls = $("a[href*='" + param + "']");
        regex = new RegExp(param + "\\d+");
    } else {
        $urls = $(param).first().find("a");
        regex = new RegExp("[a-zA-Z]+[^\d][0-9]+(?!.*[0-9])");
    }

    $urls.each(function () {
        let href = this.href;
        if (typeof href !== 'undefined' && !href.endsWith("/") && href !== currentPage && href !== currentPage + "#")
            hrefs.add(href);
    });
    console.log("hrefs : ");
    console.log(hrefs);

    // on cherche ce qui varie dans les hrefs : matching selon regex précédente
    let pageVars = new Set();
    for (let href of hrefs) {
        let pageVar = href.match(regex);
        if (pageVar !== null) {
            let matcher = pageVar[0];
            //            console.log("matcher : " + matcher);
            pageVars.add(matcher);
        }
    }
    console.log("pageVars : ");
    console.log(pageVars);

    // pageVars doit faire au moins 2 (pour éviter par exemple les norep=1 dans l'url)
    if (pageVars.size > 1) {
        // prefix
        regex = new RegExp("\\d+");
        let prefixes = new Set();
        let pageNbrs = new Set();
        for (let pageVar of pageVars) {
            let pageNbr = pageVar.match(regex);
            if (pageNbr !== null) {
                let matcher = pageNbr[0];
                pageNbrs.add(matcher);
                let prefix = pageVar.replace(matcher, "");
                prefixes.add(prefix);
            }
        }
        console.log("prefixes : ");
        console.log(prefixes);
        // on trie pageNbrs
        let pageNbrsArray = [...pageNbrs];
        pageNbrsArray.sort(function (a, b) {
            return a - b
        });
        console.log("pageNbrsArray : ");
        console.log(pageNbrsArray);

        // step
        let steps = [];
        if (pageNbrsArray.length > 2)
            for (let i = 0; i < pageNbrsArray.length - 1; i++) {
                let pageNbr = pageNbrsArray[i];
                let pageNbrNext = pageNbrsArray[i + 1];
                console.log("diff = " + (pageNbrNext - pageNbr));
                steps.push(pageNbrNext - pageNbr);
            }
        else
            steps.push(pageNbrsArray[0]);
        // on trie steps
        steps.sort(function (a, b) {
            return a - b
        });
        console.log("steps : ");
        console.log(steps);

        if (prefixes.size === 1 && steps.length > 0)
            prefixAndStep.push([...prefixes][0], steps[0]);

        console.log("prefixAndStep : ");
        console.log(prefixAndStep);
    }
    return prefixAndStep;
}

//function getCustomPaginationLinks(prefix, startNumber, endNumber, step) {
//    let invariant = getPaginationPrefix(prefix, startNumber, endNumber);
//    let paginationLinks = [];
//    for (let i = startNumber; i < endNumber + step; i += step) {
//        console.log("i= " + i);
//        prefix = prefix + i.toString();
//        let newInvariant = invariant.replace("x***x", prefix);
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
//function getPaginationLinksWithPageTxt(paginationTagClass) {
//    let paginationLinks = [];
//    let xHrefs = [];
//    let pageNbrs = [];
//    let pageTxts = ["page=", "start-"];
//    $(paginationTagClass).first().find("a").each(function () {
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
//function getPaginationLinks(paginationTagClass) {
//    let paginationLinks = getPaginationLinksWithPageTxt(paginationTagClass);
//    return paginationLinks;
//}


//function getPaginationLinks(paginationTagClass) {
//    let paginationLinks = [];
//    // tableau des xHrefs = on remplace les nombres dans la référence du lien par x***x
//    // le but est de trouver un invariant  : adresse/nom_du_forum ou numero_du_forum ou autre chose relatif au forum/x***x => si on remplace les nombres qui signifient les pages, donc qui varient, on doit tomber sur cet invariant
//    let xHrefs = [];
//    let pageNbrs = [];
//    $(paginationTagClass).first().find("a").each(function () {
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

//function getPaginationLinks(paginationTagClass) {
//    let paginationLinks = [];
//    let hrefs = [];
//    let pageNbrs = [];
//    $(paginationTagClass).first().find("a").each(function () {
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

function getScrappedLevel(levelStructureMap, rowNbr) {
    let map = new Map();
    for (let [rowTagClass, rowChildrenTagClass] of levelStructureMap) {
        $rowTagClass = $(rowTagClass);
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
                }
            }
            rowNbr++;
            if (Object.keys(rowChildren).length > 0)
                map.set(childUrl, rowChildren);
        });
    }
    return map;
}

function getDepthUrls(levelStructureMap) {
    let depthUrls = [];
    for (let [rowTagClass, rowChildrenTagClass] of levelStructureMap) {
        $rowTagClass = $(rowTagClass);
        let childUrl = "";
        $rowTagClass.each(function () {
            let rowChildren = {};
            for (rowChildTagClasses of rowChildrenTagClass) {
                let rowChildTagClassArray = rowChildTagClasses.split("***");
                let rowChildTitle = rowChildTagClassArray[0];
                let rowChildTagClass = rowChildTagClassArray[1];
                if (rowChildTitle === "url") {
                    let childUrl = $(this).find(rowChildTagClass).prop("href");
                    depthUrls.push(childUrl);
                    break;
                }
            }
        });
    }
    return depthUrls;
}

function getPaginationLinks(pagination) {
    let paginationLinks = new Set();
    let hrefs = new Set();
    let prefix = pagination.prefix;
    let currentPage = window.location.href;
    let $paginationTagClass = $(pagination.tagClass).first();
    let $urls = $paginationTagClass.find("a[href*='" + prefix + "']");
    $urls.each(function () {
        let href = this.href;
        if (typeof href !== 'undefined' && !href.endsWith("/") && href !== currentPage && href !== currentPage + "#")
            hrefs.add(href);
    });
    console.log("hrefs : ");
    console.log(hrefs);

    let regex = new RegExp(prefix + "\\d+");
    let xHrefs = new Set();
    let pageNbrs = new Set();
    for (let href of hrefs) {
        let xHref = href.replace(regex, "x***x");
        xHrefs.add(xHref);
        let prefixAndPageNbr = href.match(regex);
        if (prefixAndPageNbr !== null) {
            let matcher = prefixAndPageNbr[0];
            let pageNbr = matcher.match("\\d+");
            if (pageNbr !== null) {
                matcher = pageNbr[0];
                pageNbrs.add(matcher);
            }
        }
    }
    console.log("xHrefs : ");
    console.log(xHrefs);
    console.log("pageNbrs : ");
    console.log(pageNbrs);

    if (xHrefs.size === 1 && pageNbrs.size > 0) {
        let invariantUrl = [...xHrefs][0];
        let pageNbrsArray = [...pageNbrs];
        pageNbrsArray.sort(function (a, b) {
            return a - b
        });
        let lastPage = pageNbrsArray[pageNbrsArray.length - 1];
        lastPage = Number(lastPage);
        let step = pagination.step;
        for (let i = step; i < lastPage + step; i += step) {
            console.log("i= " + i);
            let newPrefix = prefix + i;
            console.log("newPrefix : " + newPrefix);
            let link = invariantUrl.replace("x***x", newPrefix);
            console.log("link : " + link);
            paginationLinks.add(link);
        }
        console.log("paginationLinks : ");
        console.log(paginationLinks);
    }
    return [...paginationLinks];
}
