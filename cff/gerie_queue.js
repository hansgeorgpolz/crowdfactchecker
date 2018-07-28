function GerieQueue() {
    var self = this;
    this.done = 0;
    var queue = [];
    var init = 0;

    function requestFacts(sentence, callback, ext_callback) {
        var request = sentence.replace(/\s/g, "%20");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://localhost:8080/gerie?sentence="+request, true);
        xmlHttp.onreadystatechange = function () {
            if(xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                try {
                    callback(JSON.parse(xmlHttp.responseText), ext_callback);
                }
                catch(e) {
                    console.log(e);
                    callback(null, ext_callback);
                }
            }
            else if(xmlHttp.readyState === 4)
                callback(null, ext_callback)
        }
        xmlHttp.send(null);
    }

    function run(ext_callback) {
        var callback = function(response, ext_callback) {
            if(ext_callback != undefined) {
                ext_callback(response, queue.length);
            }
            else console.log("Error im GerieQueue: External callback was undefined.");

            if (queue.length > 0)
                run(ext_callback);
            else init = 0;
        }

        var sentence = queue.shift();
        requestFacts(sentence, callback, ext_callback);
    }

    this.queue = function(sentence, callback) {
        queue.push(sentence);
        if (0 === init++) {
            run(callback);
        }
    }
}