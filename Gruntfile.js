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
        src: ['mask.js']
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
      files: {
        src: ['tests/test.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('_jshint', ['jshint']);
  grunt.registerTask('_qunit', ['qunit']);

  grunt.registerTask('default', ['_jshint', '_qunit']);

};
