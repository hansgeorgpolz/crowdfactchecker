var bgp = chrome.extension.getBackgroundPage();
var Histogram = bgp.Histogram;
var GerieQueue = bgp.GerieQueue;
var FactCollector = bgp.FactCollector;
FactCollector.facts = [];
FactCollector.data_for_histogram = [];
var Evaluator = new bgp.Evaluator(FactCollector.facts);
var table = document.getElementById("results_table");

function animateStatus(results) {
    var number_of_dots = (display_status.innerText.match(/\./g) || []).length;
    if (number_of_dots < 10)
        display_status.innerText = display_status.innerText += ".";
    else
        display_status.innerText = display_status.innerText.slice(0, -9);

    display_total.innerText = (results.total_facts).toString();

    var output_text = results.relevant_facts + ": " + bgp.q_object +
        " AND " + bgp.q_subject;
    display_relevant.innerText = output_text;

    display_result.innerText = results.evaluation;
}

function printUrl(url) {
    var li = document.createElement("li");
    li.innerHTML = url.toString();
    document.getElementById("urls").appendChild(li);
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    switch(request.type) {
        case "new_fact":
            Evaluator.factCheck(request.index);
            break;
        case "all_done":
            display_status.textContent = "DONE";
            break;
        case "evaluation_results":
            Evaluator.total_facts++;
            animateStatus(request.results);
            break;
        case "print_url":
            printUrl(request.url);
            break;
    }
})

function btnHistClicked() {
    if(GerieQueue.done === 1) {
        console.log("Creating histogram.");
        Histogram.createHistogram(FactCollector.data_for_histogram, display_histogram, canvas, table);
    }
}

var btn_hist = document.getElementById("btnHist");
btn_hist.addEventListener("click", btnHistClicked);

document.title = bgp.question;
document.getElementById("headline").innerHTML = bgp.question;

var display_total = document.getElementById("total");
display_total.innerText = "0";
var display_relevant = document.getElementById("relevant");
display_relevant.innerText = "0";
var display_status = document.getElementById("status");
display_status.innerText = "";
var display_histogram = document.getElementById("hist");
display_histogram.style.display = "none";
var canvas = document.getElementById("canvas");
var display_result = document.getElementById("eval");

document.getElementById("sor").innerHTML = bgp.q_subject + " | " + bgp.q_object + " | " + bgp.q_relation;

FactCollector.openNewTabAndRunScript(bgp.urls.shift());