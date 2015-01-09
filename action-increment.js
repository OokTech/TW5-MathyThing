/*\
title: $:/plugins/inmysocks/MathyThing/action-increment.js
type: application/javascript
module-type: widget

Action widget that increments a number in a field.

<$action-increment $tiddler=someTiddler $field=fieldToIncrement $increment=incrementValue $length=zeroPadLength $prefix=outputPrefix $intial=initialValue/>

$tiddler defaults to <<currentTiddler>> 
$field defaults to make_sure_you_give_a_field_parameter
$increment defaults to 1
$length has no default, if no length is given than the output will have no zero padding
$prefix has no default, if no prefix is given the output isn't given a prefix
$initial defaults to 0

Putting:

<$button>Test
<$action-increment/>
</$button>

into a blank tiddler will, when the button is pressed the first time, make a field called make_sure_you_give_a_field_parameter and set the value to zero. Then each time the button is pressed the value in that field will increment by one.

This will take the value of fieldToIncrement in someTiddler and increment it by incrementValue.

The increment value can be negative or non-integer, the actual action is currentValue+incrementValue.

Note to me: Look in boot.js to see if you can make this incremet times as well, by days, minutes, hours, etc.

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
	this.actionField = this.getAttribute("$field","make_sure_you_give_a_field_parameter");
	this.actionIndex = this.getAttribute("$index");
	this.padLength = this.getAttribute("$length","0");
	this.prefixValue = this.getAttribute("$prefix")
	this.initialValue = this.getAttribute("$initial","0")

	var incVal = this.getAttribute("$increment",1);
	var tiddler = this.wiki.getTiddler(this.actionTiddler);
	var tempvalue = tiddler.getFieldString(this.actionField);

	//Put a value in the field if the field is empty, with a prefix if a prefix is given
	if ( tempvalue ) {
	} else if ( this.prefixValue ) {
		if ( this.padLength ) {
			tempvalue = String(this.prefixValue)+String($tw.utils.pad(this.initialValue,this.padLength));
		} else {
			tempvalue = String(this.prefixValue)+String(this.initialValue);
		}
	} else if ( this.padLength ) {
			tempvalue = $tw.utils.pad(this.initialValue,this.padLength);
	} else {
			tempvalue = String(this.initialValue);
	}
	
	//Get the current value in the field, removing a prefix if one is given
	if ( this.prefixValue ) {
		var oldvalue = tempvalue.slice(this.prefixValue.length,tempvalue.length);
	} else if ( tiddler.getFieldString(this.actionField) ) {
		var oldvalue = tiddler.getFieldString(this.actionField);
	} else {
		var oldvalue = tempvalue;
	}

	//If either the existing value or the increment value are not numbers leave the field alone.
	if ( !isNaN(parseFloat(oldvalue)) && isFinite(oldvalue) && !isNaN(parseFloat(incVal)) && isFinite(incVal) ) { 
		var output = Number(oldvalue) + Number(incVal);
		if ( this.padLength ) {
			this.actionValue = $tw.utils.pad(output,this.padLength)
		} else {
			this.actionValue = output;
		} 
		if ( this.prefixValue ) {
			this.actionValue = String(this.prefixValue)+String(this.actionValue);
		}
	} else {
		this.actionValue = String(oldvalue);
	}
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
IncrementWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["$tiddler"] || changedAttributes["$field"] || changedAttributes["$index"] || changedAttributes["$increment"] || changedAttributes["$length"]) {
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
