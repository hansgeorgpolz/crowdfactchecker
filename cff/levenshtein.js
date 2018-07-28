function Levenshtein(threshold) {
    var INVALID_INPUT = 9999;

    this.levenshtein = function(s, t) {
        if (s == null || t == null)
            return INVALID_INPUT;
        if (s.length === 0 || t.length === 0)
            return INVALID_INPUT;

        s = s.toString();
        t = t.toString();

        var matrix = [];
        for (var i = 0; i <= Math.max(s.length, t.length); i++) {
            if (i <= s.length) matrix[i] = [i];
            if (i <= t.length) matrix[0][i] = i;
        }
        for (var i = 1; i <= s.length; i++) {
            for (var j = 1; j <= t.length; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[s.length][t.length];
    }

    this.THRESHOLD = threshold;

    this.evaluate = function(s, t) {
        if (this.levenshtein(s, t) <= this.THRESHOLD)
            return true;
        else return false;

    }
}