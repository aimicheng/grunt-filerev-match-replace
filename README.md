# grunt-filerev-match-replace

> Replace assert references reversioned by filerev

## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```
$ npm install --save-dev grunt-filerev grunt-filerev-match-replace
```

[grunt]: http://gruntjs.com
[Getting Started]: http://gruntjs.com/getting-started


## Overview

This task will replace asserts references in css, html, pug files. You can write your own match analyzer to process assert references in any kind of template file.


### Example

```js
var analyzers = [
    'css-background-analyzer',
    'html-image-analyzer',
    'html-link-analyzer',
    'html-script-analyzer'
];
analyzers.push(require('path/to/your/own/analyzer'));

grunt.initConfig({
    filerev: {
        options: {
            algorithm: 'md5',
            length: 8
        },
        asserts: {
            src: 'dest/**/*.{js,css,png,jpg,svg,gif,jpeg}'
        }
    },
    filerev_match_replace: {
        dist: {
            src: 'dest/**/*.{css,js,html}',
            options: {
                analyzers: analyzers,
                webroot: "dest/" //which dir is considers as root '/'
            }
        }
    }
});
```

### Options

#### analyzers

Type: `Array`<br>
Default: `undefined`

`analyzers` is a list of analyzers used to analyze source code.
You can use analyzers defined by this plugin by simply add the name to the array(as example code shows).
Analyzers defined by this plugin include:

- `css-background-analyzer`, replace assert references in background defined in css files.
- `html-image-analyzer`, replace assert references in img tags defined in html files.
- `html-link-analyzer`, replace assert references in link tags defined in html files.
- `html-script-analyzer`, replace assert references in script tags defined in html files.
- `pug-link-analyzer`, replace assert references in link tags defined in pug files.
- `pug-script-analyzer`, replace assert references in script tags defined in pug files.
- `pug-image-analyzer`, replace assert references in img tags defined in pug files.

You can add you own analyzer by adding the module object to `analyzers` array.

#### webroot

Type: `string`<br>
Default: ``

The dir which considered as root in assert url.

#### How to write your own analyzer?

An analyzer is a module which exports two functions: `accept` and `analyze`.

```js
module.exports = {
    except: function(filetype) {
        return filetype === 'html';
    },
    analyze: function(content) {

    }
};
```

- function `accept` takes one parameter `filetype` which indicates current file's filename extension(like: html, js, css).
You can determine what kind of file this analyzer wish to process. As the example code above shows, the analyzer only process html files.

- function `analyze` takes one parameter `content` which is the string content of the source file.
You can search code for replace in `analyze` function using regular expression or whatever.
`analyze` must return a plain object like this:

```js
{
    "background: url(/asserts/images/bg.png)": {
        "origin_url": "/asserts/images/bg.png",
        "count": 2
    }
}
```
The return value above tells replace task that, `background: url(/asserts/images/bg.png)` in source file need to be replaced, `origin_url` is the url of an assert, `count` means `background: url(/asserts/images/bg.png)` appears twice in the source code(need to be replaced twice).

[example code](https://github.com/aimicheng/grunt-filerev-match-replace/blob/master/lib/analyzers/css-background-analyzer.js)

## License

[MIT license](https://opensource.org/licenses/mit-license.php)
