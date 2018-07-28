function FactCollector(gerie_queue) {
    var self = this;
    self.GerieQueue = gerie_queue;
    self.facts = [];
    self.data_for_histogram = [];
    var tabIDs = [];

    function saveSubjectOrObject(fact, index, type) {
        var temp = [];
        if(type === "subject") {
            var content = fact.subject;
            var other = fact.object;
        }
        else if(type === "object") {
            var content = fact.object;
            var other = fact.subject;
        }

        if(content.constructor === Array) {
            for(var j = 0; j < content.length; j++) {
                temp = (content[j]).split(/[\s,]+/);
                for(var k = 0; k < temp.length; k++) {
                    temp[k] = removeUnwantedSymbols(temp[k]);
                    var fact_relation = {fact:temp[k], relation:fact.relation, other:other};
                    if (isFactValid(temp[k])) {
                        index.push(self.facts.push(fact_relation) - 1);
                        self.data_for_histogram.push(temp[k]);
                    }

                }
            }
        }
        else {
            temp = (content).split(/[\s,]+/);
            for(var k = 0; k < temp.length; k++) {
                temp[k] = removeUnwantedSymbols(temp[k]);
                var fact_relation = {fact:temp[k], relation:fact.relation, other:other};
                if (isFactValid(temp[k])) {
                    index.push(self.facts.push(fact_relation) - 1);
                    self.data_for_histogram.push(temp[k]);
                }
            }
        }

    }

    function saveFactToArray(fact) {
        var index = [];
        for(var i = 0; i < fact.length; i++) {
            saveSubjectOrObject(fact[i], index, "subject");
            saveSubjectOrObject(fact[i], index, "object");
        }
        return index;
    }

    this.openNewTabAndRunScript = function(url) {
        if(url != null) {
            chrome.tabs.create({url: url, active: true}, function (tab) {
                tabIDs.push(tab.id);
                chrome.tabs.executeScript(tab.id, {file: "cs_grab_results.js"});
            });
            chrome.runtime.sendMessage({type: "print_url", url: url});
        }
        else {
            console.log("Error in display_results.js: Url was unreadeable.");
            if(urls.length > 0) openNewTabAndRunScript(urls.shift());
        }
    }

    var queue_callback = function(response, queue_length) {
        if(queue_length === 0 && urls.length === 0) {
            //console.log(self.facts);
            chrome.runtime.sendMessage({type: "all_done"});
            GerieQueue.done = 1;
        }

        if(response != null) {
            if(response.length > 0) {
                var index = saveFactToArray(response);
                chrome.runtime.sendMessage({type: "new_fact", index: index});
            }
        }
    }

    function handleResponse(arg) {
        if(arg === null) {
            self.GerieQueue.queue("", queue_callback);
        }
        else {
            var text = substituteProblematicSequences(arg);
            var sentences = splitTextBySentences(text);
            if(sentences != null) {
                for (var i = 0; i < sentences.length; i++) {
                    sentences[i] = formatText(sentences[i]);
                    if (isValidSentence(sentences[i])) {
                        self.GerieQueue.queue(sentences[i], queue_callback);
                    }
                }
            }
        }
    }

    chrome.tabs.onRemoved.addListener(function(tabId) {
        if(tabIDs.includes(tabId)) {
            if(urls.length > 0) FactCollector.openNewTabAndRunScript(urls.shift());
        }
    })

    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
        switch(request.type) {
            case "result":
                callback(handleResponse(request.result, request.tab_id));
                break;
        }
    })

}