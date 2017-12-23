/*\
title: $:/plugins/inymsocks/MathyThing/action-sumfield.js
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

var ActionSumFieldWidget = function(parseTreeNode,options) {
	// Main initialisation inherited from widget.js
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ActionSumFieldWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ActionSumFieldWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
ActionSumFieldWidget.prototype.execute = function() {
	// Get attributes
	this.actionTiddler = this.getAttribute("$tiddler",this.getVariable("currentTiddler"));
	this.sumField = this.getAttribute("$sumfield");
	this.storeField = this.getAttribute("$storefield","store_field");
	this.storeIndex = this.getAttribute("$index");
	this.defaultValue = this.getAttribute("$defaultvalue",0);
  this.decimals = this.getAttribute("$decimals");
	// Compose the list elements
	this.list = this.getTiddlerList();
	// Get current value
	this.storetiddler = this.wiki.getTiddler(this.actionTiddler);
	if (this.storetiddler) {
		var currentState = this.storetiddler.getFieldString(this.storeField);
	} else {
		var currentState = 0;
	}
	// Check for an empty list, if the list isn't empty compute the sum
	if(this.list.length === 0) {
	  output = this.defaultValue; //return the default value when there is nothing to sum, if it isn't set than return 0
	} else {
	  var output = 0;
	  for (var i = 0; i < this.list.length; i++) {
	    var tidtitle = this.list[i];
	    var tiddler = this.wiki.getTiddler(tidtitle);
	    if ( !isNaN(parseFloat(tiddler.getFieldString(this.sumField))) && isFinite(tiddler.getFieldString(this.sumField)) ) {
	    	output = output + Number(tiddler.getFieldString(this.sumField));
		}
	  }
	}
  // If the sum has changed then write to the field
  if (this.decimals) {
    output = output.toFixed(this.decimals);
  }
	this.output = String(output);
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ActionSumFieldWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	var output = 0;
	this.list = this.getTiddlerList();
	for (var i = 0; i < this.list.length; i++) {
	  var tidtitle = this.list[i];
	  var tiddler = this.wiki.getTiddler(tidtitle);
	  if ( !isNaN(parseFloat(tiddler.getFieldString(this.sumField))) && isFinite(tiddler.getFieldString(this.sumField)) ) {
	  	output = output + Number(tiddler.getFieldString(this.sumField));
	  }
	}
	this.storetiddler = this.wiki.getTiddler(this.actionTiddler);
	// Completely rerender if any of our attributes have changed
	if (this.storetiddler) {
		if (String(output) != String(this.storetiddler.getFieldString(this.storeField))) {
			this.refreshSelf();
			return true;
		} else if(this.stateTitle && changedTiddlers[this.stateTitle]) {
			this.readState();
			return true;
		}
	}
	return false;
};

ActionSumFieldWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[!is[system]is[system]]"; // this will always return an empty list and is always valid, so default behavior is to return an empty list
	return this.wiki.filterTiddlers(this.getAttribute("$filter",defaultFilter),this);
};

/*
Invoke the action associated with this widget
*/
ActionSumFieldWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if (this.storetiddler) {
		if (this.output === String(this.storetiddler.getFieldString(this.storeField))) {
		} else {
		  this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
		}
	} else {
		this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
	}
	return true; // Action was invoked
};

exports["action-sumfield"] = ActionSumFieldWidget;

})();
