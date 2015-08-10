"use strict";
var Bluebird = require("bluebird");
var shelljs  = require("shelljs");
var _        = require("lodash");

function Command (commandString) {
	var self = this;

	var source = _.trim(commandString);
	var tokens = commandString.split(/\s+/);
	var baseCommand = tokens.shift();

	// sort remaining tokens into options or arguments
	var opts = [];
	var args = [];
	_.each(tokens, function (token) {
		if (token.indexOf("-") === 0) {
			opts.push(token);
		}
		else {
			args.push(token);
		}
	});

	Object.defineProperty(this, "options", {
		get : function () {
			return opts;
		},

		enumerable : true
	});

	Object.defineProperty(this, "arguments", {
		get : function () {
			return args;
		},

		enumerable : true
	});

	Object.defineProperty(this, "base", {
		get : function () {
			return baseCommand;
		},

		enumerable : true
	});

	Object.defineProperty(this, "sourceString", {
		get : function () {
			return source;
		},

		enumerable : true
	});

	this.exec = function () {
		return new Bluebird(function (resolve) {
			shelljs.exec(self.sourceString, { silent : true, async : true }, function (code, output) {
				resolve({ code : code, output : output });
			});
		});
	};
}

module.exports = Command;
