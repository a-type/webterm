"use strict";

var Bluebird     = require("bluebird");
var childProcess = require("child_process");
var EventEmitter = require("events").EventEmitter;
var path         = require("path");
var util         = require("util");
var _            = require("lodash");

function Shell () {
	var self = this;
	var cwd = path.resolve(process.cwd());
	var env = _.clone(process.env);

	// todo: cross-platform
	var child = childProcess.spawn("cmd.exe", { cwd : cwd, env : env, stdio : "pipe" });
	child.stdin.setEncoding("utf-8");

	child.stdout.on("data", function (data) {
		self.emit("out", data);
	});

	child.stderr.on("data", function (data) {
		self.emit("out", data);
	});

	this.runCommand = function (command) {
		child.stdin.write(command.sourceString + "\n");
	};
}

util.inherits(Shell, EventEmitter);

module.exports = Shell;
