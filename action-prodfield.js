/*\
title: $:/plugins/inymsocks/MathyThing/action-prodfield.js
type: application/javascript
module-type: widget

Multiply the values in a specified field and store the result in another field

<$prodfield filter='[tag[prod]]' prodfield='prod_field' storefield='store_field'/>

This is an edited version of the list widget from TiddlyWiki5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ActionProdFieldWidget = function(parseTreeNode,options) {
	// Main initialisation inherited from widget.js
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ActionProdFieldWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ActionProdFieldWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
ActionProdFieldWidget.prototype.execute = function() {
	// Get attributes
	this.actionTiddler = this.getAttribute("$tiddler",this.getVariable("currentTiddler"));
	this.prodField = this.getAttribute("$prodfield");
	this.storeField = this.getAttribute("$storefield","store_field");
	this.storeIndex = this.getAttribute("$index");
	this.defaultValue = this.getAttribute("$defaultvalue",0);
	// Compose the list elements
	this.list = this.getTiddlerList();
	// Get current value
	this.storetiddler = this.wiki.getTiddler(this.actionTiddler);
	var currentState = this.storetiddler.getFieldString(this.storeField);
	// Check for an empty list, if the list isn't empty compute the product
	if(this.list.length === 0) {
		output = this.defaultValue; //return the default value when there is nothing to product, if it isn't set than return 0
	} else {
		var output = 1;
		for (var i = 0; i < this.list.length; i++) {
			var tidtitle = this.list[i];
			var tiddler = this.wiki.getTiddler(tidtitle);
			// check to make sure that the field contains a number before using it in the product
			if ( !isNaN(parseFloat(tiddler.getFieldString(this.prodField))) && isFinite(tiddler.getFieldString(this.prodField)) ) {
				output = output * Number(tiddler.getFieldString(this.prodField));
			}
		}
	}
        // If the product has changed then write to the field
	this.output = String(output);
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ActionProdFieldWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	var output = 1;
	this.list = this.getTiddlerList();
	for (var i = 0; i < this.list.length; i++) {
		var tidtitle = this.list[i];
		var tiddler = this.wiki.getTiddler(tidtitle);
		if ( !isNaN(parseFloat(tiddler.getFieldString(this.prodField))) && isFinite(tiddler.getFieldString(this.prodField)) ) {
	  		output = output * Number(tiddler.getFieldString(this.prodField));
		}
	}
	this.storetiddler = this.wiki.getTiddler(this.actionTiddler);
	// Completely rerender if any of our attributes have changed
	if (String(output) != String(this.storetiddler.getFieldString(this.storeField))) {
		this.refreshSelf();
		return true;
	} else if(this.stateTitle && changedTiddlers[this.stateTitle]) {
		this.readState();
		return true;
	}
	return false;
};

ActionProdFieldWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[!is[system]is[system]]"; // this will always return an empty list and is always valid, so default behavior is to return an empty list
	return this.wiki.filterTiddlers(this.getAttribute("$filter",defaultFilter),this);
};

/*
Invoke the action associated with this widget
*/
ActionProdFieldWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if (this.output === String(this.storetiddler.getFieldString(this.storeField))) {
	} else {
		this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
	}
	return true; // Action was invoked
};

exports["action-prodfield"] = ActionProdFieldWidget;

})();
