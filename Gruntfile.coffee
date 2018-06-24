path = require 'path'


module.exports = (grunt) ->
  require('time-grunt') grunt
  require('load-grunt-tasks') grunt

  grunt.config.init
    coffee:
      build:
        files:
          "#{path.join('dist', 'datepicker.js')}": [
            path.join 'src', '*.coffee'
          ]
    sass:
      options:
        precision: 10
      build:
        files:
          "#{path.join('dist', 'datepicker.css')}": [
              path.join 'src', '*.scss'
            ]

  grunt.registerTask 'build', [
    'coffee:build'
    'sass:build'
  ]
