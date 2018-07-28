var text;
var urls = [];
var question;
var fact_id = 0;

chrome.contextMenus.create({
    'title': 'Fact check',
    'contexts': ['selection'],
    'id': "fact_check_context"
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({file: "cs_grab_text_on_button_press.js"});
});

var Messenger = new Messenger();
var GerieQueue = new GerieQueue();
var FactCollector = new FactCollector(GerieQueue);
var LEVENSHTEIN_THRESHOLD = 2;
var Levenshtein = new Levenshtein(LEVENSHTEIN_THRESHOLD);

var Histogram = new Histogram();

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    Messenger.handleTextResponse(info.selectionText);
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    Messenger.handleResponse(request.type, request, sender, callback);
});