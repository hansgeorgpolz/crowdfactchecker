function createParagraphs(sentences) {
    for (var i=0; i < sentences.length; i++) {
        var sentence = bgp.formatText(sentences[i]);
        if (bgp.isValidSentence(sentence)) {
            var temp_node = document.createElement("p");
            temp_node.classList.add("sentence");
            temp_node.setAttribute("id", i.toString());
            temp_node.setAttribute("active", "true");
            temp_node.addEventListener("click", function(event) {
                bgp.onClickEvent(event);
            });
            temp_node.addEventListener("dblclick", function(event) {
                bgp.onDblClickEvent(event);
            });
            var temp_text = document.createTextNode(sentence);
            temp_node.appendChild(temp_text);

            document.getElementById("t1").appendChild(temp_node);
        }
    }
}

// Add text as paragraphs marked 'sentence'
var bgp = chrome.extension.getBackgroundPage();
var text_from_bg = bgp.substituteProblematicSequences(bgp.text);
text_from_bg = bgp.removeUnwantedSymbols(text_from_bg);
var sentences = bgp.splitTextBySentences(text_from_bg);

createParagraphs(sentences);