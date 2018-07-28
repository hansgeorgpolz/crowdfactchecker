function grabTextFromActiveTab() {
    return document.body.innerText;
}

function printTextToConsole(text) {
    console.log(text)
}

var text = grabTextFromActiveTab();
printTextToConsole(text);
chrome.runtime.sendMessage({type: "initial_text", allText: text});