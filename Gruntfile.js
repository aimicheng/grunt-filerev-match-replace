module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    //load this plugin
    grunt.loadTasks('tasks');

    var analyzers = [
        'css-background-analyzer',
        'html-image-analyzer',
        'html-link-analyzer',
        'html-script-analyzer',
        'pug-link-analyzer',
        'pug-script-analyzer',
        'pug-image-analyzer'
    ];

    analyzers.push(require('./lib/js-am-analyzer'));

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [
                    { expand: true, cwd: 'test/project', src: ['**'], dest: 'dest/' }
                ]
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            asserts: {
                src: 'dest/**/*.{js,css,png,jpg,svg,gif,jpeg}'
            }
        },
        filerev_assets: {
            dist: {
                options: {
                    dest: 'dest/assets.json',
                    cwd: 'dest/'
                }
            }
        },
        filerev_match_replace: {
            dist: {
                src: 'dest/**/*.{css,js,html,pug}',
                options: {
                    analyzers: analyzers,
                    webroot: "dest/" //which dir is considers as root '/'
                }
            }
        }
    });

    // clean task
    grunt.registerTask('clean', 'clean current build.', function () {
        grunt.file.delete('dest/', {
            force: true
        });
    });

    //default
    grunt.registerTask('default', ['clean', 'copy', 'filerev:asserts', 'filerev_assets:dist', 'filerev_match_replace:dist']);
};
