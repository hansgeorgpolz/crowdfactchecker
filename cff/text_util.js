function isFactValid(fact) {
    var MIN_LENGTH = 4;

    if(fact.length < MIN_LENGTH)
        return false;

    if (fact.match(
        /^(of|seit|wie|by|her|ihres|as|the|for|we|its|here|der|die|das|und|in|zu|den|von|sie|ist|des|sich|mit|dem|dass|er|es|ein|ich|auf|so|eine|als|an|nach|nicht|wie |im|für|man|aber|aus|durch|wenn|nur|war|noch|werden|bei|auch|hat|wir|was|wird|sein|einen|welche|sind|oder|zur|um|haben|einer|mir|über|bis|habe|ihre|dann|ihnen|seiner|alle|wieder|meine|gegen|vom|ganz|einzelnen|wo|muss|ohne|eines|können|sei|ihm|diese|einem|ihr|uns|da|zum|kann|doch|vor|dieser|mich|ihn|du|hatte|seine|mehr|am|denn|nun|unter|sehr|selbst|schon|hier|seines|if|is|ab|to|be|his|had|and)$/gi
    ))
        return false;

    return true;

}

function isValidSentence(sentence) {
    var MAX_SENTENCE_LENGTH = 500;
    var MAX_DIGIT_RATIO = 0.2;
    var number_of_spaces = sentence.split(" ").length-1;

    if(sentence.length > MAX_SENTENCE_LENGTH)
        return false;

    if(((sentence.match(/\d/g) ||[]).length / sentence.length) > MAX_DIGIT_RATIO)
        return false;

    if(number_of_spaces > 0 && sentence.match(/[A-Za-z"'äÄüÜöÖß]/g))
        return true;

    return false;
}

function removeUnwantedSymbols(text) {
    text = text.replace(/([^äÄüÜöÖßA-Za-z0-9\-.?!\s])/gi, "");
    text = text.replace(/(\d+)\s([A-Z])/g, "$2");
    return text;
}

function resubstitute(text) {
    var text = text.replace(/ZBZBZB/g, "z.B.");
    text = text.replace(/ZBZSBZB/g, "z. B.");
    text = text.replace(/VCHR/g, "v. Chr.");
    text = text.replace(/NCHR/g, "n. Chr.");
    text = text.replace(/UAUA/g, "u.a.");
    text = text.replace(/UASUA/g, "u. a.");
    text = text.replace(/BZWBZW/g, "bzw.");
    text = text.replace(/DRDR/g, "Dr.");
    return text.replace(/NUMDOT/g, ".");
}

function substituteProblematicSequences(text) {
    var text = text.replace(/z\.B\./g, "ZBZBZB");
    text = text.replace(/(z\.\sB\.)/g, "ZBZSBZB");
    text = text.replace(/(v\.\sChr\.)/g, "VCHR");
    text = text.replace(/(n\.\sChr\.)/g, "NCHR");
    text = text.replace(/(u\.a\.)/g, "UAUA");
    text = text.replace(/(u\.\sa\.)/g, "UASUA");
    text = text.replace(/(bzw\.)/g, "BZWBZW");
    text = text.replace(/(Dr\.)/g, "DRDR");
    text = text.replace(/(\d)\./g, "$1");
    return text;
}

function splitTextBySentences(text) {
    return text.match(/[^.?!]+[.?!]/g);
}

function formatText(raw_text) {
    //console.log(raw_text);
    var text = removeUnwantedSymbols(raw_text);
    text = text.trim();
    text = resubstitute(text);
    return text.replace(/\s+/g,' ');
}