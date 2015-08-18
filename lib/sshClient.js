"use strict";

var Bluebird     = require("bluebird");
var Client       = require('ssh2').Client;
var childProcess = require("child_process");
var EventEmitter = require("events").EventEmitter;
var path         = require("path");
var util         = require("util");
var _            = require("lodash");

var DEBUG = process.env.DEBUG === "true";

// string starts with non-space characters, ends with >
// TODO: user-configurable
var PROMPT_MATCH = /^(\S+)>$/;

function SshClient () {
	var self = this;
	var cwd = path.resolve(process.cwd());
	var env = _.clone(process.env);

	function escapeData (data) {
		return data.replace(/\t/g, "&#9;").replace("	", "&#9;")
			.replace(/\n/g, "")
			.replace(/\r/g, ""); // todo: better handling of return carriage
	}

	function processData (dataInput, eventType) {
		var dataLines = dataInput.split("\n");

		_.each(dataLines, function (data) {
			if (/^\s*$/.test(data)) {
				return;
			}

			data = escapeData(data);

			if (DEBUG) {
				console.log("DATA>" + data);
			}

			var prompt = PROMPT_MATCH.exec(data);
			if (prompt) {
				self.emit(eventType, {
					type      : "prompt",
					cwd       : prompt[1],
					separator : ">",
					text      : data
				});
			}
			else {
				self.emit(eventType, {
					type : "output",
					text : data
				});
			}
		});
	}

	var clientStream;

	var conn = new Client();
	conn.on('ready', function() {
		console.log('Client :: ready');
		conn.shell(function(err, stream) {
			clientStream = stream;

			if (err) throw err;

			stream.on('close', function() {
				console.log('Connection Closed');
				conn.end();
			}).on('data', function(data) {
				self.emit(processData(data, "out"));
			}).stderr.on('data', function(data) {
				self.emit(processData(data, "err"));
			});
		});
	}).connect({
		host: '127.0.0.1',
		port: 22,
		username: 'user0',
		password: 'password0'
	});

	this.runCommand = function (command) {
		clientStream.write(command.sourceString + "\n");
	};

	this.windowResize = function (rows, cols, width, height) {
		clientStream.setWindow(rows, cols, width, height);
	};
}

util.inherits(SshClient, EventEmitter);

module.exports = SshClient;
