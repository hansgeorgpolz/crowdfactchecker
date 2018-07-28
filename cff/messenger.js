function Messenger() {
    var self = this;

    this.handleResponse = function(type, request, sender, callback){
        switch(type) {
            case "initial_text":
                callback(this.handleTextResponse(request.allText));
                break;
            case "urls":
                callback(handleUrlsResponse(request.urls, request.question));
                break;
            case "requestID":
                callback(sender.tab.id);
                break;
            case  "result":
                break;
            case  "evaluation_results":
                break;
            case  "new_fact":
                break;
            case  "all_done":
                break;
            default:
                console.log("Error in Messenger: Unknown response type received. Was: " + type);
        }

    }

    this.handleTextResponse = function(arg) {
        text = arg;
        chrome.tabs.create({url: "display_sentences.html"});
    }

    function handleUrlsResponse(arg1, arg2) {
        urls = arg1;
        question = arg2;
        chrome.tabs.create({url: "display_results.html"});
    }
}