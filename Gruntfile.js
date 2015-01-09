module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            concatJS: {
                src: [
                    '_src/js/libs/*.js', // All JS in the libs folder
                    '_src/js/custom/myapp.js',
                    '_src/js/custom/controllers.js',
                    '_src/js/custom/directives.js'
                    
                ],
                dest: '_build/all.js'
            }, 
            concatCSS: {
                src: [
                    '_src/css/*.css'
                ],
                dest: 'css/all.css'
            }
        },
        uglify: {
            uglifyJS: {
                src: '_build/all.js',
                dest: 'js/all.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['_src/js/**/*.js', '_src/css/*.css'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            } 
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
    

};