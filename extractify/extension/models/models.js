function Level(id, type, url, rows, pagination, tabId, someDeeperLinks) {
    this.id = id;
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

function Forum(id, url, title) {
    this.type = "forum";
    this.id = id;
    this.url = url;
    this.title = title;
    this.topics = new Map();
}

function Topic(forumId, id, url, title, nbrOfViews) {
    this.type = "topic";
    this.forumId = forumId;
    this.id = id;
    this.url = url;
    this.title = title;
    this.nbrOfViews = nbrOfViews;
    this.messages = [];
}

function Message(topicId, id, author, date, text) {
    this.type = "message";
    this.topicId = topicId;
    this.id = id;
    this.author = author;
    this.date = date;
    this.text = text;
}
