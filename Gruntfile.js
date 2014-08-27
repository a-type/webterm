var path = require('path');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		exec: {
			run: "nw.exe ."
		}
	});

	grunt.loadNpmTasks('grunt-exec');

	// Default task(s).
	grunt.registerTask('default', ['exec:run']);

};