module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: ['build/'],

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: "**",
            dest: "build/",
            cwd: "src/public",
            dot: true
          },
          {
            expand: true,
            cwd: "src/javascripts/",
            src: "**",
            dest: "build/js",
            dot: true
          }
        ]
      }
    },

    sass: {
      dev: {
        options: {
          style: "expanded",
          noCache: true,
          sourceMap: false
        },
        files: [
          {
            expand: true,
            cwd: "src/stylesheets",
            src: "*.sass",
            dest: "build/css",
            ext: ".css"
          }
        ]
      }
    },

    jade: {
      compile: {
        files: [
          {
            expand: true,
            cwd: "src/views",
            src: "*.jade",
            dest: "build/",
            ext: ".html"
          }
        ]
      }
    },


    zip: {
      "using-cwd": {
        cwd: "build/",
        src: "build/**/*",
        dest: "build/smart-tab-mute.zip"
      }
    },

    watch: {
      scripts: {
        files: ["src/**"],
        tasks: ["default"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-zip");

  grunt.registerTask("main", ["clean", "sass", "jade", "copy"]);

  var defaultTasks = ["config:dev", "main"];

  grunt.registerTask("default", ["main", "watch"]);
  grunt.registerTask("dist", ["main", "zip"]);
};
