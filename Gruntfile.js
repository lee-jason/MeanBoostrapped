module.exports = function(grunt){
  grunt.initConfig({
    config: grunt.file.readJSON('gruntconfig.json'),
    uglify: {
      buildpublic: {
        files: [{
          expand: true,
          cwd: '<%= config.publicJsSrc %>',
          src: '**/*.js',
          dest: '<%= config.publicJsBuild %>'
        }]
      }
    },
    copy: {
      buildserver: {
        expand: true,
        cwd: '<%= config.serverJsSrc %>',
        src: '**/*.*',
        dest: '<%= config.serverJsBuild %>',
      },
    },
    sass: {
      build:{
        files:[{
          expand: true,
          cwd: '<%= config.publicSassSrc %>',
          src: '**/*.scss',
          dest: '<%= config.publicSassBuild %>',
          ext: '.css'
        }]
      }
    },
    watch: {
      jsuglify: {
        files: ['<%= uglify.buildpublic.files[0].cwd %>/<%= uglify.buildpublic.files[0].src %>'],
        tasks: ['uglify']
      },
      copy: {
        files: ['<%= copy.buildserver.cwd %>/<%= copy.buildserver.src %>'],
        tasks: ['copy']
      },
      sass: {
        files: ['<%= sass.build.files[0].cwd %>/<%= sass.build.files[0].src %>'],
        tasks: ['sass']
      }
    },
    nodemon: {
      dev: {
        script: '<%= config.mainExec %>',
        options: {
          nodeArgs: ['--debug'],
          //watch: ['<%= build %>/server/**'],
          ignore: ['<%= build %>/public', '<%= src %>'],
          // omit this property if you aren't serving HTML files and  
          // don't want to open a browser tab on start 
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start 
            nodemon.on('config:update', function () {
              // Delay before server listens on port 
              setTimeout(function() {
                require('open')('http://localhost:5000');
              }, 1000);
            });

            // refreshes browser when server reboots 
            nodemon.on('restart', function () {
              // Delay before server listens on port 
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },//nodedemon is premature
    concurrent: {
      dev: {
        tasks: ['watch', 'node-inspector', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    'node-inspector': {
      dev: {
      }
    },
    clean: ["build"]
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // Default task(s).
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('build', ['clean', 'uglify', 'sass', 'copy']);
};