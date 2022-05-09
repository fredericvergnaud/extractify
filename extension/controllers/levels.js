function setOptions() {
  options = [];
  $('input[name="option"]').each(function() {
    console.log("option found : ", $(this).attr("id") + " : " + $(this).val());
    let option = new Option();
    option.name = $(this).attr('id');
    option.value = $(this).val();
    options.push(option);
  });
}

function getLevelsColsNbr() {
  var colsNbr = 0;
  for (var i = 0; i < levels.length; i++) {
    var level = levels[i];
    var rows = level.rows;
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      var cols = row.cols;
      colsNbr += cols.length;
    }
  }
  return colsNbr;
}

function getLevelsDepthNbr(level) {
  var depthNbr = 0;
  for (var i = 0; i < levels.length; i++) {
    var level = levels[i];
    var rows = level.rows;
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      var depth = row.depth;
      if (depth != null)
        depthNbr += 1;
    }
  }
  return depthNbr;
}

function makeTextFile(text) {
  var textFile = null;
  var data = new Blob([text], {
    type: 'text/plain'
  });
  if (textFile !== null)
    window.URL.revokeObjectURL(textFile);
  textFile = window.URL.createObjectURL(data);
  return textFile;
};

function jsonize() {
  var link = document.createElement('a');
  link.setAttribute('download', 'levels.json');
  link.href = makeTextFile(JSON.stringify(levels, null, "\t"));
  document.body.appendChild(link);
  window.requestAnimationFrame(function() {
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

let globalLevelsIds, globalRowsIds, globalColsIds, dejsonizedLevels, dejsonizedRows, dejsonizedCols;

function readJsonFile() {
  var fileList = this.files;
  var selectedFile = fileList[0];
  if (selectedFile != undefined) {
    var reader = new FileReader();
    var newLevels;
    reader.onload = function(e) {
      try {
        newLevels = JSON.parse(reader.result);
        //                console.log("newLevels : ", newLevels);
        if (newLevels.length > 0) {
          // test pour savoir si level ou pas
          let firstLevel = newLevels[0];
          if (firstLevel.id === undefined || firstLevel.typeKey === undefined || firstLevel.type === undefined || firstLevel.url === undefined || firstLevel.rows === undefined || firstLevel.pagination === undefined || firstLevel.tabId === undefined || firstLevel.someDeeperLinks === undefined) {
            alert(extensionLang.InvalidJsonFile);
            return;
          } else {
            globalLevelsIds = new Set();
            globalRowsIds = new Set();
            globalColsIds = new Set();
            dejsonizedLevels = 0;
            dejsonizedRows = 0;
            dejsonizedCols = 0;

            // on efface levels en cours
            if (levels.length > 0) {
              var levelsToRemove = [];
              for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                levelsToRemove.push(level);
              }
              removeLevels(levelsToRemove);
            }
            // on ajoute les nouveaux
            levels = newLevels;

            // tests sur les ids pour détecter les doublons d'id
            for (level of levels) {
              // calcul des variables globales
              globalLevelsIds.add(level.id);
              dejsonizedLevels++;
              if (level.rows.length > 0)
                for (row of level.rows) {
                  globalRowsIds.add(row.id);
                  dejsonizedRows++;
                  if (row.cols.length > 0)
                    for (col of row.cols) {
                      globalColsIds.add(col.id);
                      dejsonizedCols++;
                    }
                }
            }
            if (globalLevelsIds.size !== dejsonizedLevels)
              alert(extensionLang.LevelIdError);
            else if (globalRowsIds.size !== dejsonizedRows)
              alert(extensionLang.LevelRowsIdError);
            else if (globalColsIds.size !== dejsonizedCols)
              alert(extensionLang.LevelRowsColsIdError);
            else {
              // dejsonize
              dejsonize(levels);
              // affichage fichier
              displayJsonFile(selectedFile);
            }
          }
        }
      } catch (error) {
        alert(extensionLang.JsonFileParseError + error);
        return;
      }
    }
    reader.readAsText(selectedFile);
  }
}

async function dejsonize(levels) {
  for (const level of levels) {
    // on crée un nouveau tab
    await createNewTab(level.url)
      .then(function(tabId) {
        console.log("level dejsonized in tab id " + tabId)
        level.tabId = tabId;
        loadLevel(level);
        highlightContent(tabId, level);
      })
      .then(function() {
        globalLevelsIdsTab = [...globalLevelsIds];
        globalLevelsIdsTab.sort((a, b) => a - b);
        globalLevelId = globalLevelsIdsTab[globalLevelsIdsTab.length - 1] + 1;

        globalRowsIdsTab = [...globalRowsIds];
        globalRowsIdsTab.sort((a, b) => a - b);
        globalRowId = globalRowsIdsTab[globalRowsIdsTab.length - 1] + 1;

        globalColsIdsTab = [...globalColsIds];
        globalColsIdsTab.sort((a, b) => a - b);
        globalColId = globalColsIdsTab[globalColsIdsTab.length - 1] + 1;
      });
  }
}

function displayJsonFile(file) {
  let dejsonized_file_wrapper = document.getElementById("dejsonized_file_wrapper");
  dejsonized_file_wrapper.innerHTML = file.name;
}

function removeDisplayedJsonFile() {
  let dejsonized_file_wrapper = document.getElementById("dejsonized_file_wrapper");
  dejsonized_file_wrapper.innerHTML = '';
}

function loadLevel(level) {
  fillLevelTypes(level.typeKey, level.type)
  displayLevel(level);

  // Pagination
  if (level.pagination != null) {
    displayPagination(level);
    updateLevelDisplay(level);
    updateLevelsDisplay();
  }
  // Rows, cols, depth
  for (let row of level.rows) {
    displayRow(row, level);
    updateLevelDisplay(level);
    updateLevelsDisplay();
    for (let col of row.cols) {
      fillColTitles(col.titleKey, col.title);
      displayCol(col, row, level);
      updateRowDisplay(row, level);
      updateLevelDisplay(level);
      updateLevelsDisplay();
    }
    if (row.depth != null) {
      displayDepth(row.depth, row, level);
      updateRowDisplay(row, level);
      updateLevelDisplay(level);
      updateLevelsDisplay();
    }
  }
}

function fillColTitles(colTitleKey, colTitle) {
  if (!(colTitleKey in colTitles))
    colTitles[colTitleKey] = colTitle;
}

function fillLevelTypes(levelTypeKey, levelType) {
  if (!(levelTypeKey in levelTypes))
    levelTypes[levelTypeKey] = levelType;
}

// SCRAPING

let rowNbr, scrapedObjects, scrapedObjectsCount, stopScraping, scrapingErrorsNbr, visitedPaginationLinks;

function initScraping() {
  rowNbr = 0;
  scrapedObjects = [];
  scrapedObjectsCount = new Map();
  stopScraping = 0;
  initScrapingResultsDialog();
  scrapingErrorsNbr = 0;
  visitedPaginationLinks = new Set();
}

function getLevelStructureMap(level) {
  let levelStructureMap = new Map();
  let rows = level.rows;
  for (let row of rows) {
    let rowSelector = row.selector;
    let cols = row.cols;
    for (let col of cols) {
      let colSelector = col.selector;
      let colTitleKey = col.titleKey;
      var elemStructure = colTitleKey + "***" + colSelector;
      if (!levelStructureMap.has(rowSelector)) {
        var elemStructureArray = [elemStructure];
        levelStructureMap.set(rowSelector, elemStructureArray);
      } else {
        var elemStructureArray = levelStructureMap.get(rowSelector);
        elemStructureArray.push(elemStructure);
      }
    }
    if (row.depth !== null) {
      var depthSelector = row.depth.selector;
      var elemStructure = "url***" + depthSelector;
      if (!levelStructureMap.has(rowSelector)) {
        var elemStructureArray = [elemStructure];
        levelStructureMap.set(rowSelector, elemStructureArray);
      } else {
        var elemStructureArray = levelStructureMap.get(rowSelector);
        elemStructureArray.push(elemStructure);
      }
    }
  }
  return levelStructureMap;
}

function jsonizeScraping() {
  var link = document.createElement('a');
  link.setAttribute('download', 'scraping.json');
  if (scrapedObjects.length > 0)
    link.href = makeTextFile(JSON.stringify(scrapedObjects, null, "\t"));
  document.body.appendChild(link);
  window.requestAnimationFrame(function() {
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

async function scrapLevels(tabId, requestLatency, scrapingPageInOwnTab) {
  for (const level of levels) {
    if (stopScraping === 0) {
      // Scrap du LEVEL 0
      if (level.id === 0) {
        console.log("Scraping of LEVEL 0 (id = " + level.id + ") | scrapedObjects lenght = " + scrapedObjects.length);
        await getScrapedPage(tabId, level.url, level.id, scrapedObjects, requestLatency, scrapingPageInOwnTab)
      } else {
        // Scrap des levels en dessous
        console.log("Scraping of LEVEL " + level.id + " | scrapedObjects lenght = " + scrapedObjects.length);
        for (const scrapedObject of scrapedObjects) {
          if (stopScraping === 0) {
            if (scrapingPageInOwnTab === "true")
              tabId = level.tabId;
            await getScrapedPage(tabId, scrapedObject.url, level.id, scrapedObject.deeperLevel, requestLatency, scrapingPageInOwnTab)
              .then(async function() {
                if (getLevel(level.id + 1) !== undefined)
                  await scrapLevel(tabId, level, scrapedObject, requestLatency, scrapingPageInOwnTab);
              });
          } else {
            console.log("scraping aborted");
            return;
          }
        }
      }
    } else {
      console.log("scraping aborted");
      return;
    }
  }
}

async function scrapLevel(tabId, level, scrapedObject, requestLatency, scrapingPageInOwnTab) {
  let levelIdSup = level.id + 1;
  for (const deeperLevelObject of scrapedObject.deeperLevel) {
    if (stopScraping === 0) {
      await getScrapedPage(tabId, deeperLevelObject.url, levelIdSup, deeperLevelObject.deeperLevel, requestLatency, scrapingPageInOwnTab)
        .then(async function() {
          if (getLevel(levelIdSup + 1) !== undefined)
            await scrapLevel(tabId, getLevel(levelIdSup + 1), deeperLevelObject, requestLatency, scrapingPageInOwnTab);
        });
    } else {
      console.log("scraping aborted");
      return;
    }
  }
}

async function getScrapedPage(tabId, url, levelId, scrapedObjects, requestLatency, scrapingPageInOwnTab) {
  console.log("Scraping of " + url + " with stopScraping = " + stopScraping);
  // Ajout de l'url scrapée à visitedPaginationLinks
  visitedPaginationLinks.add(url);
  // Scraping de la page d'adresse url
  if (stopScraping === 0) {
    await scrapPage(tabId, url, [...getLevelStructureMap(levels[levelId])], requestLatency, scrapingPageInOwnTab)
      .then(function(scrapedPage) {
        console.log("Scraped Page received :", scrapedPage);
        if (scrapedPage === "noData")
          scrapingErrorsNbr++;
        else
          return processPageScraping(scrapedPage, levelId, scrapedObjects);
      })
      .then(async function() {
        let level = getLevel(levelId);
        if (level.pagination !== null) {
          console.log("Pagination not null ");
          await getPaginationLinks(tabId, url, level, scrapedObjects, requestLatency, scrapingPageInOwnTab)
        } else
          console.log("pagination null ");
      });
  } else {
    console.log("scraping aborted");
    return;
  }
}

// SCRAP PAGINATION

async function getPaginationLinks(tabId, url, level, scrapedObjects, requestLatency, scrapingPageInOwnTab) {
  console.log("Search pagination link in page : ", url);
  await scrapPaginationLinks(tabId, url, level.pagination)
    .then(async function(scrapedPaginationLinks) {
      if (scrapedPaginationLinks === "noData")
        scrapingErrorsNbr++;
      else {
        console.log("Scraped pagination links received = ", scrapedPaginationLinks);
        if (scrapedPaginationLinks !== undefined && scrapedPaginationLinks.length > 0) {
          for (const scrapedPaginationLink of scrapedPaginationLinks) {
            if (!visitedPaginationLinks.has(scrapedPaginationLink)) {
              await getScrapedPageFromPaginationLink(tabId, scrapedPaginationLink, level.id, scrapedObjects, requestLatency, scrapingPageInOwnTab);
              visitedPaginationLinks.add(scrapedPaginationLink);
            }
          }
        }
      }
    });
}

async function getScrapedPageFromPaginationLink(tabId, url, levelId, scrapedObjects, requestLatency, scrapingPageInOwnTab) {
  console.log("Scraping of " + url + " with stopScraping = " + stopScraping);
  if (stopScraping === 0) {
    await scrapPage(tabId, url, [...getLevelStructureMap(levels[levelId])], requestLatency, scrapingPageInOwnTab)
      .then(function(scrapedPage) {
        if (scrapedPage === "noData")
          scrapingErrorsNbr++;
        return processPageScraping(scrapedPage, levelId, scrapedObjects)
      });
  } else {
    console.log("scraping aborted");
    return;
  }
}

function processPageScraping(result, levelId, scrapedObjects) {
  if (result !== "noData") {
    let resultMap = new Map(result);
    //        console.log("resultMap :", resultMap);
    for (let [url, children] of resultMap) {
      if (url !== null) {
        let scrapedObject = new Object();
        scrapedObject.type = levels[levelId].type;
        scrapedObject.typeKey = levels[levelId].typeKey;
        for (let child in children) {
          for (let key in colTitles)
            if (child === key)
              scrapedObject[key] = children[child].replace(/\s+/g, ' ').replace(/[\n\r]/g, '').trim();
          if (child === "url")
            scrapedObject.url = children[child];
        }
        scrapedObject.deeperLevel = [];
        if (containsScrapedObject(scrapedObject, scrapedObjects) === false) {
          scrapedObjects.push(scrapedObject);
          // update results
          if (scrapedObjectsCount.has(scrapedObject.typeKey))
            scrapedObjectsCount.set(scrapedObject.typeKey, scrapedObjectsCount.get(scrapedObject.typeKey)+1);
          else
            scrapedObjectsCount.set(scrapedObject.typeKey, 1);
          updateScrapingResultsDialog(scrapedObject.typeKey, scrapedObject.type);
        } else
          console.log("scrapedObject already existing : ", scrapedObject);
      }
    }
  } else {
    console.log("processLevelScraping : noData");
    return;
  }
}

function containsScrapedObject(scrapedObject, scrapedObjects) {
  var i;
  for (i = 0; i < scrapedObjects.length; i++)
    if (JSON.stringify(scrapedObjects[i]) === JSON.stringify(scrapedObject))
      return true;
  return false;
}

function endScrap(tabId, scrapingPageInOwnTab) {
  console.log("endScrap : tabId = " + tabId + " | stopscraping = " + stopScraping + " | scrapingPageInOwnTab = " + scrapingPageInOwnTab);
  jsonizeScraping();
  // if (scrapingPageInOwnTab === "false" && tabId !== null)
  //   chrome.tabs.remove(tabId);
  // if (stopScraping === 0)
    switchScrapingResultsDialogButton(tabId);
    //closeScrapingResultsDialog();

}
