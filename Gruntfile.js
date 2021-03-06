module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// concat to merge js&css files
		concat: {
			options: {
				// define separator for the merged files
				separator: ';'
			},
			jsConcat: {
				src: ['static_src/js/*.js'],
				dest: 'static_src/<%= pkg.name %>_all.js'
			},
			cssConcat: {
				src: ['static_src/css/*.css'],
				dest: 'static_src/<%= pkg.name %>_all.css'
			}
		},

		// uglify to compress js files
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				//uglify can compress the js files from concat task  
				files: {
					'app/templates/assets/js/<%= pkg.name %>.min.js': ['<%= concat.jsConcat.dest %>']
				}
			}
		},

		
		jshint: {			
			options: {
				jshintrc: '.jshintrc'
			},
			build: ['Gruntfile.js', 'static_src/js/*.js']
		},

		// cssmin to compress css files
		cssmin:{
            options:{
                stripBanners: true,
                banner:'/*!<%= pkg.name %> - <%= pkg.version %>-'+'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build:{
                src:'static_src/<%= pkg.name %>_all.css',
                dest:'app/templates/assets/css/<%= pkg.name %>.min.css'
            }
        },
        
        csslint:{
            options:{
                csslintrc: '.csslintrc'
            },
            build:['static_src/css/*.css']
         },

		watch: {
			build: {
				files: ['static_src/css/*.css', 'static_src/js/*.js'],
				tasks: ['csslint', 'jshint', 'concat', 'cssmin', 'uglify'],
				options: { spawn: false }
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('build', ['jshint','csslint','concat', 'cssmin', 'uglify', 'watch']);
};