'use strict';
var path = require('path');
var utils = require('../lib/utils'),
    filename = utils.filename,
    normolize_url = utils.normolize_url;

//check analyzer object
function is_analyzer_object(obj) {
    return obj && typeof obj === 'object' && typeof obj.accept === 'function' && typeof obj.analyze === 'function';
}

module.exports = function(grunt) {
    grunt.registerMultiTask('filerev_match_replace', 'Replace references to grunt-filerev files.', function() {
        var options = this.options(),
            url_map = {},
            analyzers = [];

        //load internal analyzer by name
        function load_analyzer(name) {
            analyzers.push(require('../lib/analyzers/' + name));
        }

        //init analyzers
        if (options.analyzers) {
            options.analyzers.forEach(function(analyzer) {
                if (typeof analyzer === 'string') {
                    load_analyzer(analyzer);
                } else if (is_analyzer_object(analyzer)) {
                    analyzers.push(analyzer);
                }
            });
        }
        for (var key in grunt.filerev.summary) {
            var reversioned_path = utils.filepath_2_url(grunt.filerev.summary[key], options.webroot);
            key = utils.filepath_2_url(key, options.webroot);
            url_map[key] = {
                origin: filename(key),
                rev: filename(reversioned_path)
            };
        }
        this.files[0].src.forEach(function(view_src) {
            var view = grunt.file.read(view_src),
                current_path = path.dirname(utils.filepath_2_url(view_src, options.webroot)),
                changes = [],
                filetype = path.extname(view_src).substr(1);
            analyzers.forEach(function(analyzer) {
                if (analyzer.accept && !analyzer.accept(filetype)) {
                    return;
                }
                //find target
                var found = analyzer.analyze(view);
                //resove path
                if (found) {
                    for(var key in found) {
                        var item = found[key];
                        var url = normolize_url(item.origin_url, current_path),
                            replace_item,
                            real_url = normolize_url(item.real_url ? item.real_url : item.origin_url, current_path);
                        replace_item = url_map[real_url];

                        if (replace_item) {
                            if (analyzer.replace) {
                                item.replace_url = analyzer.replace(item, replace_item);
                            } else {
                                item.replace_url = item.origin_url.replace(replace_item.origin, replace_item.rev);
                                item.replace_url = key.replace(item.origin_url, item.replace_url);
                            }
                            for (var i = 0; i < item.count; i++) {
                                view = view.replace(key, item.replace_url);
                            }
                            changes.push({
                                origin: key,
                                rev: item.replace_url
                            });
                        }
                    }
                }
            });
            if (changes.length > 0) {
                grunt.log.writeln('✔ '.green+ view_src);
                changes.forEach(function(item) {
                    grunt.log.writeln("\t"+ item.origin + ' => ' + item.rev);
                });
            }
            grunt.file.write(view_src, view);
        });
    });
};
