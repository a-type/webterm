"use strict";

var Command = require("./command");

module.exports.runCommand = function (commandString) {
	return (new Command(commandString)).exec();
};
