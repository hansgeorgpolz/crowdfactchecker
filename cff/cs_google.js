var urls = [];

var url_pattern = /^((http|https|ftp):\/\/(?!(webcache.googleusercontent|books.google|(\.pdf$)|(\.ppt$))))/;

function isLinkSame(link) {
    for(var i=0; i < urls.length; i++) {
        if(link === urls[i])
            return true;
    }
    return false;
}

function isLinkValid(link) {
    return url_pattern.test(link);
}

var content_element = document.getElementById("search");
var links = content_element.getElementsByTagName("a");

for (var i = 0; i < links.length; i++) {
    var link = links[i].getAttribute("href");
    if(link != null) {
        link = link.replace(/#-*/, "");
        if (isLinkValid(link) && !isLinkSame(link))
            urls.push(link);
    }
}

console.log(urls);

var hidden= document.body.appendChild(document.createElement("div"));
hidden.style.display = "none";

var search_form = document.getElementById("lst-ib");
var question = search_form.value;
console.log(question);

chrome.runtime.sendMessage({type: "urls", urls: urls, question: question});
window.close();
