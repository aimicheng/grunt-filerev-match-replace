var define_search = /(define|requirejs)\s*[^\[]+\[[^\]]+]/gi;
var define_capture = /\[([^\]]+)]/i;

module.exports = {
    accept: function(filetype) {
        return filetype === 'js';
    },
    analyze: function(content) {
        var replace_map = {},
            matches = content.match(define_search);
        if (!matches) {
            return null;
        }
        matches.forEach(function(item) {
            if (replace_map[item]) {
                replace_map[item].count ++;
                return;
            }
            var caputre_matches = item.match(define_capture);
            if (caputre_matches && caputre_matches[1]) {
                replace_map[item] = {
                    list: [],
                    count: 1
                };
                var module_list = caputre_matches[1].split(',');
                module_list.forEach(function(module_id) {
                    if (module_id.match(/^(http:\/\/|https:\/\/|\/\/)/)) {
                        return;
                    }
                });
                // {
                //     origin_url: caputre_matches[2],
                //     count: 1
                // };
            }
        });

        return replace_map;
    }
};
