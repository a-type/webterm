"use strict";
var Command = require("../../lib/command");
var Sinon   = require("sinon");
var _       = require("lodash");

var expect = require("chai").expect;

describe("The Command object", function () {
	describe("creating a command", function () {
		describe("with no args or options", function () {
			it("has correct data", function () {
				var cmd = new Command("ls");
				expect(_.omit(cmd, _.functions(cmd)), "props").to.deep.equal({
					base         : "ls",
					options      : [],
					arguments    : [],
					sourceString : "ls"
				});
			});
		});

		describe("with args only", function () {
			it("has correct data", function () {
				var cmd = new Command("ls / /usr");
				expect(_.omit(cmd, _.functions(cmd)), "props").to.deep.equal({
					base         : "ls",
					options      : [],
					arguments    : [ "/", "/usr" ],
					sourceString : "ls / /usr"
				});
			});
		});

		describe("with options only", function () {
			it("has correct data", function () {
				var cmd = new Command("ls -a -l");
				expect(_.omit(cmd, _.functions(cmd)), "props").to.deep.equal({
					base         : "ls",
					options      : [ "-a", "-l" ],
					arguments    : [],
					sourceString : "ls -a -l"
				});
			});
		});

		describe("with args and options", function () {
			it("has correct data", function () {
				var cmd = new Command("ls -a -l / /usr");
				expect(_.omit(cmd, _.functions(cmd)), "props").to.deep.equal({
					base         : "ls",
					options      : [ "-a", "-l" ],
					arguments    : [ "/", "/usr" ],
					sourceString : "ls -a -l / /usr"
				});
			});
		});
	});
});
