var path = require('path');

module.exports = {
    //get filename in file path
    filename: function (filepath) {
        return filepath.substr(filepath.lastIndexOf('/') + 1);
    },
    //convert file path to url according on webroot
    filepath_2_url: function(filepath, webroot) {
        var url = filepath;
        url = url.replace(/\\/g, '/');
        if (url.startsWith(webroot)) {
             url = url.replace(webroot, '');
        }
        if (!url.startsWith('/')) {
            url = '/' + url;
        }
        return url;
    },
    //normolize relative url to absolute url
    normolize_url: function(url, current_path) {
        url = url.trim().replace(/(^['"]|['"]$)/g, '');
        if (!path.isAbsolute(url)) {
            url = path.normalize(current_path + '/' + url);
        }
        //remove query string & hash tag
        url = url.replace(/[#?].*$/g, '');
        return url;
    }
};
