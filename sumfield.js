/*\
title: $:/plugins/inymsocks/MathyThing/sumfield.js
type: application/javascript
module-type: widget

Sum the values in a specified field and store the result in another field

<$sumfield filter='[tag[sum]]' sumfield='sum_field' storefield='store_field'/>

This is an edited version of the list widget from TiddlyWiki5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var SumFieldWidget = function(parseTreeNode,options) {
	// Main initialisation inherited from widget.js
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
SumFieldWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SumFieldWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
SumFieldWidget.prototype.execute = function() {
	// Get attributes
	this.actionTiddler = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.sumField = this.getAttribute("sumfield");
	this.storeField = this.getAttribute("storefield");
	this.storeIndex = this.getAttribute("index");
	this.defaultValue = this.getAttribute("defaultvalue",0);
	// Compose the list elements
	this.list = this.getTiddlerList();
	// Get current value
	var storetiddler = this.wiki.getTiddler(this.actionTiddler);
	var currentState = storetiddler.getFieldString(this.storefield);
	// Check for an empty list
	if(this.list.length === 0) {
	  output = this.defaultValue; //return the default value when there is nothing to sum, if it isn't set than return 0
	} else {
	  var output = 0;
	  for (var i = 0; i < this.list.length; i++) {
	    var tidtitle = this.list[i];
	    var tiddler = this.wiki.getTiddler(tidtitle);
	    var output = output + Number(tiddler.getFieldString(this.sumField));
	  }
	}
	if (currentState != String(output)) {
	  this.output = String(output);
	  this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
	}
};

SumFieldWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[!is[system]is[system]]"; // this will always return an empty list and is always valid, so default behavior is to return an empty list
	return this.wiki.filterTiddlers(this.getAttribute("filter",defaultFilter),this);
};

exports.sumfield = SumFieldWidget;

})();
