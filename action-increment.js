/*\
title: $:/plugins/inmysocks/MathyThing/action-increment.js
type: application/javascript
module-type: widget

Action widget that increments a number in a field.

<$action-increment $tiddler=someTiddler $field=someField $increment=someIncrement/>

$tiddler defaults to <<currentTiddler>> and $increment defaults to 1

This will take the value of someField in someTiddler and increment it by  someIncrement.

The increment value can be negative or non-integer, the actual action is currentValue+incrementValue.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var IncrementWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
IncrementWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
IncrementWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
IncrementWidget.prototype.execute = function() {
	this.actionTiddler = this.getAttribute("$tiddler",this.getVariable("currentTiddler"));
	this.actionField = this.getAttribute("$field");
	this.actionIndex = this.getAttribute("$index");

	var incVal = this.getAttribute("$increment",1);
	
	var tiddler = this.wiki.getTiddler(this.actionTiddler);
	var oldvalue = tiddler.getFieldString(this.actionField)

	//If either the existing value or the increment value are not numbers leave the field alone. This includes empty or fields that don't exist. So fields need to be initialized.
	if ( !isNaN(parseFloat(oldvalue)) && isFinite(oldvalue) && !isNaN(parseFloat(incVal)) && isFinite(incVal) ) { 
		var output = Number(oldvalue) + Number(incVal);
		this.actionValue = String(output);
	} else {
		this.actionValue = String(oldvalue);
	}
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
IncrementWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["$tiddler"] || changedAttributes["$field"] || changedAttributes["$index"] || changedAttributes["$increment"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
IncrementWidget.prototype.invokeAction = function(triggeringWidget,event) {
	var self = this;
	if(typeof this.actionValue === "string") {
		this.wiki.setText(this.actionTiddler,this.actionField,this.actionIndex,this.actionValue);		
	}
	return true; // Action was invoked
};

exports["action-increment"] = IncrementWidget;

})();
