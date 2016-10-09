'use strict';
var path = require('path');

//normolize relative url to absolute url
function normolize_url(url, current_path) {
    url = url.trim().replace(/(^['"]|['"]$)/g, '');
    if (!path.isAbsolute(url)) {
        url = path.normalize(current_path + '/' + url)
    }
    //remove query string & hash tag
    url = url.replace(/[#?].*$/g, '');
    return url;
}

//convert file path to url according on webroot
function filepath_2_url(filepath, webroot) {
    var url = filepath;
    if (filepath.startsWith(webroot)) {
         url = filepath.replace(webroot, '');
    }
    url.replace("\\", '/');
    if (!url.startsWith('/')) {
        url = '/' + url;
    }
    return url;
}

//get filename in file path
function filename(filepath) {
    return filepath.substr(filepath.lastIndexOf(path.sep) + 1);
}

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
            var reversioned_path = filepath_2_url(grunt.filerev.summary[key], options.webroot);
            key = filepath_2_url(key, options.webroot);
            url_map[key] = {
                origin: filename(key),
                rev: filename(reversioned_path)
            };
        }
        this.files[0].src.forEach(function(view_src) {
            var view = grunt.file.read(view_src),
                current_path = path.dirname(filepath_2_url(view_src, options.webroot)),
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
                        var url = normolize_url(item.origin_url, current_path);
                        if (url_map[url]) {
                            item.replace_url = item.origin_url.replace(url_map[url].origin, url_map[url].rev);
                            for (var i = 0; i < item.count; i++) {
                                view = view.replace(key, key.replace(item.origin_url, item.replace_url));
                            }
                            changes.push(item);
                        }
                    }
                }
            });
            if (changes.length > 0) {
                grunt.log.writeln('✔ '.green+ view_src);
                changes.forEach(function(item) {
                    grunt.log.writeln("\t"+ item.origin_url + ' => ' + item.replace_url);
                });
            }
            grunt.file.write(view_src, view);
        });
    });
};
