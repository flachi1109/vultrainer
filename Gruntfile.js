module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// concat to merge js files
		concat: {
			options: {
				// define separator for the merged files
				separator: ';'
			},
			dist: {
				src: ['js_modules/*.js'],
				dest: 'app/templates/assets/js/<%= pkg.name %>.js'
			}
		},

		// uglify to compress js files
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <% grunt.templates.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				//uglify can compress the js files from concat task  
				files: {
					'app/templates/assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		// jshint to check standard of js code
		jshint: {
			files: ['Gruntfile.js', 'js_modules/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},


		watch: {
			build: {
				files: ['src/*.js'],
				tasks: ['jshint', 'uglify'],
				options: { spawn: false }
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['concat', 'uglify', 'jshint', 'watch']);
};