var regx = /background\s*:\s*url\s*\([^)]+\)/gi;
var capture_regx = /background\s*:\s*url\s*\(([^)]+)\)/i;

module.exports = {
    accept: function(filetype) {
        return filetype === 'css';
    },
    /**
     * analyze source code
     * @param {String} content
     * @return {Object} return a plain object, for example:
     *  {
     *      "background: url(/asserts/images/bg.png)": {
     *          "origin_url": "/asserts/images/bg.png",
     *          "count": 2
     *      }
     *  }
     */
    analyze: function(content) {
        var replace_map = {},
            matches = content.match(regx);
        if (!matches) {
            return null;
        }
        matches.forEach(function(item) {
            if (replace_map[item]) {
                replace_map[item].count ++;
                return;
            }
            var caputre_matches = item.match(capture_regx);
            replace_map[item] = {
                origin_url: caputre_matches[1],
                count: 1
            };
        });
        return replace_map;
    }
};
