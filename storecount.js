/*\
title: $:/plugins/inmysocks/MathyThing/storecount.js
type: application/javascript
module-type: widget

Count widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MyCountWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
MyCountWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MyCountWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
MyCountWidget.prototype.execute = function() {
	this.actionTiddler = this.getAttribute("$tiddler",this.getVariable("currentTiddler"));
	this.actionField = this.getAttribute("$field");
	this.actionIndex = this.getAttribute("$index");
	this.filter = this.getAttribute("$filter");
	
	// Execute the filter
	var tiddler = this.wiki.getTiddler(this.actionTiddler);
	var oldvalue = tiddler.getFieldString(this.actionField);
	if(this.filter) {
		this.currentCount = this.wiki.filterTiddlers(this.filter,this).length;
	} else {
		this.currentCount = undefined;
	}
	this.actionValue = this.currentCount.toString();

	if ( oldvalue === this.actionValue ) {
	} else {
		this.wiki.setText(this.actionTiddler,this.actionField,this.actionIndex,this.actionValue);
	}
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
MyCountWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["$tiddler"] || changedAttributes["$field"] || changedAttributes["$index"] || changedAttributes["$lower"] || changedAttributes["$upper"] || changedAttributes["$step"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports["storecount"] = MyCountWidget;

})();