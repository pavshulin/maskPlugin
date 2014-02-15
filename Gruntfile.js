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
        src: ['mask.js', 'test/openMask.js']
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
          src: [
            'mask.js', 
            'tests/openMask.js'
          ],
          instrumentedFiles: 'temp/',
          coberturaReport: 'report/',
          htmlReport: 'report/coverage',
        }
      },
      all: [
        'tests/test.html',
        'tests/internalTest.html'
        ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  grunt.registerTask('_jshint', ['jshint']);
  grunt.registerTask('_qunit', ['qunit']);

  grunt.registerTask('default', ['_jshint', '_qunit']);

};
