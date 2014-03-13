/*
 * grunt-cli
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-init/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: {
        src: ['src/mask.js']
      },
        options: {
          '-W030': true,
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          unused: true,
          boss: true,
          eqnull: true,
          node: true,
          globals: {
            jQuery: true
          } 
        }
      
    },
    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          coberturaReport: 'report/',
          htmlReport: 'report/coverage'
        }
      },
      all: [
        'tests/test.html'
        ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  grunt.registerTask('default', ['jshint', 'qunit']);

};
