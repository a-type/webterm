"use strict";
var Command = require("../../lib/command");
var shelljs = require("shelljs");
var Sinon   = require("sinon");
var _       = require("lodash");

var expect = require("chai").expect;

describe("The Command object", function () {
	var sandbox;

	before(function () {
		sandbox = Sinon.sandbox.create();
		sandbox.stub(shelljs);
	});

	after(function () {
		sandbox.restore();
	});

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

	describe("executing a command", function () {
		before(function () {
			(new Command("ls -al .")).exec();
		});

		after(function () {
			shelljs.exec.reset();
		});

		it("passes the command to shell", function () {
			expect(shelljs.exec.calledWith("ls -al .")).to.be.true;
		});
	});
});
