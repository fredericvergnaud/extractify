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

function Pagination(dataType, tagClass) {
    this.dataType = "pagination";
    this.tagClass = tagClass;
    this.prefix = null;
    this.step = 0;
    
}

function Row(dataType, id, tagClass, depth, color) {
    this.dataType = "row";
    this.id = id;
    this.tagClass = tagClass;
    this.cols = [];
    this.depth = null;
    this.color = color;
}

function Col(dataType, id, titleKey, title, tagClass, url) {
    this.dataType = "col";
    this.id = id;
    this.titleKey = titleKey;
    this.title = title;
    this.tagClass = tagClass;
    this.url = url;
}

function Depth(dataType, id, tagClass) {
    this.dataType = "depth";
    this.id = id;
    this.tagClass = tagClass;
}

function Option(name, value) {
    this.name = name;
    this.value = value;
}