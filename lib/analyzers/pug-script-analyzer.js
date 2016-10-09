var script_search = /script\([^\)]+\)/gi;
var script_src_capture = /src\s*=\s*([^"]*|[^']*)("([^"]+)"|'([^']+)')/i;

module.exports = {
    accept: function(filetype) {
        return filetype === 'pug';
    },
    analyze: function(content) {
        var replace_map = {},
            matches = content.match(script_search);
        if (!matches) {
            return null;
        }
        matches.forEach(function(item) {
            if (replace_map[item]) {
                replace_map[item].count ++;
                return;
            }
            var caputre_matches = item.match(script_src_capture);
            if (caputre_matches && caputre_matches[3]) {
                replace_map[item] = {
                    origin_url: caputre_matches[3],
                    count: 1
                };
            }
        });

        return replace_map;
    }
};
