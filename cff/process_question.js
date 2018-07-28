var sentence_event;
var q_subject;
var q_relation;
var q_object;
var google_url = "googleurlgoesinhere";

function openGoogleAndRunQuestion(question) {
    google_url = "http://www.google.de/search?q="+question;
    chrome.tabs.create({url: google_url, active: true}, function(tab) {
        google_url = tab.url;
    })
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tab.url = tab.url.replace(/&gws_rd=ssl/g, "");
    if (tab.url.substring(5) === google_url.substring(4) && changeInfo.status == 'complete') {
        chrome.tabs.executeScript(tabId, {file: "cs_google.js"});
    }
});

function changeBackgroundColor(is_response_valid) {
    if (is_response_valid && sentence_event != null) {
        sentence_event.target.style.backgroundColor = "silver";
    }
    else if (sentence_event != null){
        sentence_event.target.style.backgroundColor = "red";
    }

}

function onMenuClickEvent(event) {
    var node = event.target;
    var edit_mode = node.parentElement.getAttribute("edit");
    if(edit_mode === "false") {
        node.style.backgroundColor = "silver";
        q_subject = node.getAttribute("subject");
        q_relation = node.getAttribute("relation");
        q_object = node.getAttribute("object");
        openGoogleAndRunQuestion(node.getAttribute("subject") + "+" + node.getAttribute("relation") + "+"
            + node.getAttribute("object") + "?");
    }
    else {
    }
}

function createEditableNodes(row, data) {
    for(var i = 0; i < 3; i++) {
        var editable_node = document.createElement("td");
        switch(i) {
            case 0:
                editable_node.textContent = data.getAttribute("subject");
                break;
            case 1:
                editable_node.textContent = data.getAttribute("relation");
                break;
            case 2:
                editable_node.textContent = data.getAttribute("object");
                break;
            default:
                break;
        }
        editable_node.contentEditable = "true";
        row.setAttribute("index", data.getAttribute("index"));
        row.appendChild(editable_node);
    }
}

function updateQuestions(menu_node) {
    var table = menu_node.getElementsByClassName("table")[0];
    var questions = menu_node.getElementsByClassName("question");
    for(var i = 0; i < questions.length; i++) {
        var row = table.rows[i];
        questions[i].setAttribute("subject", row.cells[0].textContent);
        questions[i].setAttribute("relation", row.cells[1].textContent);
        questions[i].setAttribute("object", row.cells[2].textContent);
        questions[i].textContent = row.cells[0].textContent + " " + row.cells[1].textContent + " "
            + row.cells[2].textContent + "?";
    }
}

function onEditClickEvent(event) {
    var event_node = event.target;
    var menu_node = event_node.parentElement;
    var edit_mode = menu_node.getAttribute("edit");
    var child_nodes = menu_node.childNodes;

    if(edit_mode === "false") {
        event_node.textContent = "done";
        menu_node.setAttribute("edit", "true");
        menu_node.style.backgroundColor = "lightblue";
        var table = document.createElement("table");
        table.classList.add("table");
        for(var i = 0; i < child_nodes.length; i++) {
            if(child_nodes[i].className === "question") {
                child_nodes[i].style.display = "none";
                child_nodes[i].setAttribute("index", i.toString());
                var row = document.createElement("tr");
                createEditableNodes(row, child_nodes[i]);
                table.appendChild(row);
            }
        }
        menu_node.appendChild(table);
    }
    else {
        event_node.textContent = "edit";
        menu_node.setAttribute("edit", "false");
        menu_node.style.backgroundColor = "white";
        updateQuestions(menu_node);
        for(var i = 0; i < child_nodes.length; i++) {
            if(child_nodes[i].className === "question") {
                child_nodes[i].style.display = "block";
            }
            if(child_nodes[i].className === "table") {
                menu_node.removeChild(child_nodes[i]);
            }
        }
    }
}

function addSelectionMenu(response) {
    var menu_node = document.createElement("div");
    menu_node.setAttribute("id", "menu"+(fact_id++).toString());
    menu_node.classList.add("menu");
    menu_node.setAttribute("edit", "false");

    var edit_node = document.createElement("p");
    edit_node.classList.add("edit");
    edit_node.textContent = "edit";
    edit_node.addEventListener("click", function(event) {
        onEditClickEvent(event);
    });
    menu_node.appendChild(edit_node);

    for(var i = 0; i < response.length; i++) {
        var question_node = document.createElement("p");
        var question = response[i].subject + " " + response[i].relation + " " + response[i].object + "?";
        question_node.innerText = question;
        question_node.classList.add("question");
        question_node.setAttribute("subject", (response[i].subject).toString());
        question_node.setAttribute("relation", (response[i].relation).toString());
        question_node.setAttribute("object", (response[i].object).toString());
        question_node.setAttribute("id", menu_node.getAttribute("id")+":"+i.toString());
        question_node.addEventListener("click", function(event) {
            onMenuClickEvent(event);
        });
        menu_node.appendChild(question_node);
    }
    sentence_event.target.appendChild(menu_node);
}

function getFactData(response) {
    if(response[0] != null) {
        q_subject = response[0].subject;
        q_relation = response[0].relation;
        q_object = response[0].object;
    }
}

function clickEventCallback(response) {
    if(response != null) {
        getFactData(response);
        changeBackgroundColor(true);
        addSelectionMenu(response)
    }
    else {
        changeBackgroundColor(false);
    }
}

function dblClickEventCallback(response) {
    if(response != null) {
        getFactData(response);
        var question = response[0].subject + "+" + response[0].relation + "+" + response[0].object + "?";
        changeBackgroundColor(true);
        openGoogleAndRunQuestion(question);
    }
    else {
        changeBackgroundColor(false);
    }
}

function onClickEvent(event) {
    if (event.target.className === "sentence" && event.target.getAttribute("active") === "true") {
        sentence_event = event;
        event.target.setAttribute("active", "false");
        //console.log(event.target.textContent);
        GerieQueue.queue(event.target.textContent, clickEventCallback);
    }
}

function onDblClickEvent(event) {
    if (event.target.className === "sentence") {
        sentence_event = event;
        //console.log(event.target.textContent);
        GerieQueue.queue(event.target.textContent, dblClickEventCallback);
    }
}