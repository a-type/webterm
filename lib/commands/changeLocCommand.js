"use strict";
var BaseCommand  = require("./baseCommand");
var Bluebird     = require("bluebird");
var EventEmitter = require("events").EventEmitter;
var utils        = require("util");
var _            = require("lodash");

function ChangeLocCommand (commandString, existingCwd, existingEnv) {
	BaseCommand.call(this);
}

utils.inherits(ChangeLocCommand, BaseCommand);

ChangeLocCommand.prototype._runCommand = function () {
	// check if directory exists
	var dir = this.args[0];
	return resolveDir(dir)
	.then(function (absolutePath) {
		if (absolutePath) {
			this._shell.cwd = absolutePath;
			return 0;
		}
		else {
			return 1;
		}
	})
}

ChangeLocCommand.COMMAND_NAMES = [ /cd/i ];

module.exports = ChangeLocCommand;
