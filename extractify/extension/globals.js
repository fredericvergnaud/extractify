console.log("globals.js loaded");

var levelTypes = {"forum":"Forum", "topic":"Topic", "message":"Message"};
var forumColTitles = {"forum_title":"Forum title"};
var topicColTitles = {"topic_title":"Topic title", "topic_number_of_views":"Topic number of views"};
var messageColTitles = {"message_author":"Message author", "message_date":"Message date", "message_text":"Message text"};

document.addEventListener('DOMContentLoaded', function () {
    let background = chrome.extension.getBackgroundPage();
    extensionWindowId = background.extensionWindowId;
    originalTabUrl = background.originalTabUrl;
    originalTabId = background.originalTabId;
    originalWindowId = background.originalWindowId;
    console.log('globals.js : ' + extensionWindowId + " | " + originalTabUrl + " | " + originalTabId + " | " + originalWindowId);
    start();
});


