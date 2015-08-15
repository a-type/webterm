"use strict";

var Bluebird     = require("bluebird");
var childProcess = require("child_process");
var Commands     = require("./commands");
var EventEmitter = require("events").EventEmitter;
var path         = require("path");
var util         = require("util");
var _            = require("lodash");

var DEBUG = process.env.DEBUG === "true";

// string starts with non-space characters, ends with >
// TODO: user-configurable
var PROMPT_MATCH = /^(\S+)>$/;

function Shell () {
	var self = this;
	this.cwd = path.resolve(process.cwd());
	this.env = _.clone(process.env);

	var buffer = "";

	function handleData (data) {
		emitData(data);
	}

	function handleError (errorData) {
		emitData(data);
	}

	function emitData (data) {
		self.emit("data", data);
	}

	this.tokenizeCommandChain = function (input) {
		var line = input;
		var tokenized = [];
		var match = Commands.CHAIN_OPERATOR_MATCH.exec(line);
		while (match) {
			var chainOp = match[1];
			var commandString = line.slice(0, line.indexOf(chainOp)).trim();
			tokenized.push(commandString);
			tokenized.push(chainOp);
			line = line.slice(line.indexOf(chainOp) + chainOp.length).trim();
			match = Command.CHAIN_OPERATOR_MATCH.exec(line);
		}
		tokenized.push(line);

		return tokenized;
	}

	this.acceptInput = function (input) {
		buffer += input;
		if (input[0] === 13) {
			self.runLine(buffer);
			buffer = "";
		}
		else {
			emitData(input);
		}
	};

	this.runLine = function (input) {
		var tokenized = this.tokenizeCommandChain(input);
		var command = this.Command(tokenized.shift());

		// build promise chain with any remaining tokens
		if (tokenized.length) {
			var lastCommand = command;

			while (tokenized.length) {
				var op = tokenized.shift();
				var nextCommand = this.Command(tokenized.shift());
				lastCommand = lastCommand.chain(op, nextCommand);
			}

			// evaluates to run completion promise of last command
			return lastCommand.run();
		}
		else {
			return command.run();
		}
	};

	this.Command = function (commandString) {
		var CommandType = Commands.fromString(commandString);
		var command = new CommandType(commandString, this);
		command.on("data", handleData);
		command.on("error", handleError);
		return command;
	};
}

util.inherits(Shell, EventEmitter);

module.exports = Shell;
