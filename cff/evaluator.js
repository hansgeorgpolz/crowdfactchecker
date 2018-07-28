var Evaluator = function(facts) {
    var self = this;
    self.subject_match = 0;
    self.object_match = 0;
    self.relevant_facts = 0;
    self.total_facts = 0;
    self.facts = facts;

    //TODO Switch for evaluating relations as well (low result count)
    self.no_relation_eval = true;
    //TODO Switch for requiring subject and object of the same fact to match (low result count)
    self.require_sub_and_ob_match = true;

    function splitFacts(fact) {
        var temp = fact.split(/[\s,]+/);
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (isFactValid(temp[i]))
                result.push(temp[i]);
        }
        return result;
    }

    self.subject_parts = splitFacts(q_subject);
    self.object_parts = splitFacts(q_object);

    function matchFacts(fact, match_array, relation) {

        if(self.no_relation_eval || Levenshtein.evaluate(relation, q_relation)) {
            for (var i = 0; i < match_array.length; i++) {
                if (Levenshtein.evaluate(fact, match_array[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    function evaluateFact(fact) {
        if(fact != undefined) {
            //self.total_facts++;
            if (self.require_sub_and_ob_match) {
                if( (matchFacts(fact.fact, self.subject_parts, fact.relation) && matchFacts(fact.other, self.object_parts, fact.relation)) ||
                    (matchFacts(fact.fact, self.object_parts, fact.relation) && matchFacts(fact.other, self.subject_parts, fact.relation))) {
                    self.subject_match++;
                    self.object_match++;
                    self.relevant_facts++;
                    self.relevant_facts++;
                }
            }
            else {
                if (matchFacts(fact.fact, self.subject_parts, fact.relation)) {
                    self.subject_match++;
                    self.relevant_facts++;
                }
                if (matchFacts(fact.fact, self.object_parts, fact.relation)) {
                    self.object_match++;
                    self.relevant_facts++;
                }
            }
        }
        else
            console.log("Error in evaluator: 'fact' was null.");
    }

    function evaluateResult() {

        var RELEVANT_THRESHOLD = 10;

        if (self.relevant_facts > RELEVANT_THRESHOLD) {
                return "TRUE";
        }
        else if (self.total_facts > 10)
            return "FALSE";
        else
            return "NOT ENOUGH DATA";
    }

    this.factCheck = function(index) {
        for (var i = 0; i < index.length-1; i++) {
            var fact = self.facts[index[i]];
            evaluateFact(fact);
        }

        var evaluation = evaluateResult();

        var results = {
            total_facts: self.total_facts, relevant_facts: self.relevant_facts, object_match: self.object_match,
            subject_match: self.subject_match, evaluation: evaluation
        };
        chrome.runtime.sendMessage({type: "evaluation_results", results: results});
    }
}