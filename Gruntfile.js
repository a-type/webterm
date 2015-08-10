"use strict";

module.exports = function (grunt) {
	var _ = grunt.util._;

	var sourceFiles = [ "*.js", "lib/**/*.js" ];
	var testFiles   = [ "test/**/*.js" ];
	var jsFiles     = sourceFiles.concat(testFiles);

	var lessFiles = "./lib/assets/less/**/*.less";

	var defaultJsHintOptions = grunt.file.readJSON("./.jshint.json");
	var testJsHintOptions = _.defaults(
		grunt.file.readJSON("./test/.jshint.json"),
		defaultJsHintOptions
	);

	grunt.initConfig({
		jscs : {
			src     : jsFiles,
			options : {
				config : ".jscsrc"
			}
		},

		jshint : {
			src     : sourceFiles,
			options : defaultJsHintOptions,
			test    : {
				options : testJsHintOptions,
				files   : {
					test : testFiles
				}
			}
		},

		mochaIstanbul : {
			coverage : {
				src     : "test/unit",
				options : {
					check : {
						statements : 100,
						branches   : 100,
						lines      : 100,
						functions  : 100
					},

					mask      : "**/*_spec.js",
					recursive : true
				}
			}
		},

		mochaTest : {
			integration : {
				options : {
					reporter : "spec",
					timeout  : 4000
				},

				src : [ "test/integration/**/*_spec.js" ]
			},
			unit        : {
				options : {
					reporter : "spec"
				},

				src : [ "test/unit/**/*_spec.js" ]
			}
		},

		watch : {
			less : {
				files : lessFiles,
				tasks : [ "less:default" ]
			}
		},

		less : {
			default : {
				files : {
					"./static/css/style.css" : "./lib/assets/less/style.less"
				}
			}
		},

		clean : [ "coverage" ]
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks("grunt-mocha-istanbul");
	grunt.loadNpmTasks("grunt-mocha-test");

	// Rename tasks
	grunt.task.renameTask("mocha_istanbul", "mochaIstanbul");

	// Register tasks
	grunt.registerTask("assets", [ "less:default" ]);
	grunt.registerTask("test", [ "clean", "assets", "mochaIstanbul:coverage" ]);
	grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
	grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
	grunt.registerTask("integration", "Run integration tests", [ "mochaTest:integration" ]);

	grunt.registerTask("default", [ "clean", "lint", "style", "test" ]);
};
