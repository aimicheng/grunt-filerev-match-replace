var link_search = /link\([^\)]+\)/gi;
var link_href_capture = /href\s*=\s*([^"]*|[^']*)("([^"]+)"|'([^']+)')/i;

module.exports = {
    accept: function(filetype) {
        return filetype === 'pug';
    },
    analyze: function(content) {
        var replace_map = {},
            matches = content.match(link_search);
        if (!matches) {
            return null;
        }
        matches.forEach(function(item) {
            if (replace_map[item]) {
                replace_map[item].count ++;
                return;
            }
            var caputre_matches = item.match(link_href_capture);
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
