"use strict";

function Line () {
	this.text = "";

	// TODO: explore re: this blog post http://blog.atom.io/2015/06/16/optimizing-an-important-atom-primitive.html
	// about storing attribute markers as relative objects in a binary search tree. Is it relevant to terminals?
	this.attributes = {};
}
