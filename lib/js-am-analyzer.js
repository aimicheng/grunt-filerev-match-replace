var res_search = /am\([^\)]+\)/gi;
var res_src_capture = /am\(([^\)]+)\)/i;

module.exports = {
    accept: function(filetype) {
        return filetype === 'js';
    },
    analyze: function(content) {
        var replace_map = {},
            matches = content.match(res_search);
        if (!matches) {
            return null;
        }
        matches.forEach(function(item) {
            if (replace_map[item]) {
                replace_map[item].count ++;
                return;
            }
            var caputre_matches = item.match(res_src_capture);
            //console.log(caputre_matches);
            if (caputre_matches && caputre_matches[1]) {
                var origin_url = caputre_matches[1],
                    real_url = origin_url.trim().replace(/(^['"]|['"]$)/g, '');
                if (!real_url.endsWith('.js')) {
                    real_url += '.js';
                }

                replace_map[item] = {
                    origin_url: origin_url,
                    real_url: real_url,
                    count: 1
                };
            }
        });
        return replace_map;
    },
    replace: function(item, replace_item) {
        return item.origin_url.replace(replace_item.origin.replace('.js', ''), replace_item.rev.replace('.js', ''));
    }
};
