function Level(id, typeKey, type, url, rows, pagination, tabId, someDeeperLinks) {
    this.id = id;
    this.typeKey = typeKey;
    this.type = type;
    this.url = url;
    this.rows = [];
    this.pagination = null;
    this.tabId = tabId;
    this.someDeeperLinks = [];
}

function Pagination(dataType, selector) {
    this.dataType = "pagination";
    this.selector = selector;
    this.constantUrl = "";
    this.start = 0;
    this.step = 0;
    this.stop = 0;
    this.selectionType = "";
}

function Row(dataType, id, selector, depth, color) {
    this.dataType = "row";
    this.id = id;
    this.selector = selector;
    this.cols = [];
    this.depth = null;
    this.color = color;
}

function Col(dataType, id, titleKey, title, selector, url) {
    this.dataType = "col";
    this.id = id;
    this.titleKey = titleKey;
    this.title = title;
    this.selector = selector;
    this.url = url;
    this.selectionType = "";
}

function Depth(dataType, id, selector) {
    this.dataType = "depth";
    this.id = id;
    this.selector = selector;
    this.selectionType = "";
}

function Option(name, value) {
    this.name = name;
    this.value = value;
}
