function grabTextFromActiveTab() {
    /*if(document.documentElement.lang === "de" ||
        document.documentElement.lang === "de-DE") {
        return document.body.textContent;
    }
    else
        return null;*/
    return document.body.innerText;
}

var text = grabTextFromActiveTab();
var id;
chrome.runtime.sendMessage({type: "requestID"}, function(response) {
    id = response;
    chrome.runtime.sendMessage({type: "result", result: text, tab_id: id});
    window.close();
    window.close();
    window.close();
    window.close();
});

