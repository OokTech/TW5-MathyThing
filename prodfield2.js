/*\
title: $:/plugins/inymsocks/MathyThing/prodfield2.js
type: application/javascript
module-type: widget

Multiply the values in two specified fields and store the result in another field

<$prodfield2 filter='[tag[prod]]' prodfield='prod_field' prodfield2='prod_field2' storefield='store_field'/>

This is an edited version of the list widget from TiddlyWiki5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ProdFieldWidget2 = function(parseTreeNode,options) {
	// Main initialisation inherited from widget.js
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ProdFieldWidget2.prototype = new Widget();

/*
Render this widget into the DOM
*/
ProdFieldWidget2.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
ProdFieldWidget2.prototype.execute = function() {
	// Get attributes
	this.actionTiddler = this.getAttribute("tiddler",0);
	this.prodField = this.getAttribute("prodfield");
	this.prodField2 = this.getAttribute("prodfield2");
	this.storeField = this.getAttribute("storefield","store_field");
	this.storeIndex = this.getAttribute("index");
	this.defaultValue = this.getAttribute("defaultvalue",0);
	// Compose the list elements
	this.list = this.getTiddlerList();
	// Check for an empty list, if the list isn't empty compute the product
	if(this.list.length === 0) {
		output = this.defaultValue; //return the default value when there is nothing to product, if it isn't set than return 0
	} else {
		for (var i = 0; i < this.list.length; i++) {
			var output = 1;
			var tidtitle = this.list[i];
			var tiddler = this.wiki.getTiddler(tidtitle);
			// check to make sure that the field contains a number before using it in the product
			if ( !isNaN(parseFloat(tiddler.getFieldString(this.prodField))) && isFinite(tiddler.getFieldString(this.prodField)) && !isNaN(parseFloat(tiddler.getFieldString(this.prodField2))) && isFinite(tiddler.getFieldString(this.prodField2)) ) {
				output = Number(tiddler.getFieldString(this.prodField)) * Number(tiddler.getFieldString(this.prodField2));
			}
			 // If the product has changed then write to the field
			this.output = String(output);
			if ( this.actionTiddler === 0 ) {
				if (this.output === String(tiddler.getFieldString(this.storeField))) {
				} else {
					this.wiki.setText(tidtitle,this.storeField,this.storeIndex,this.output);
				}
			} else {
				var tiddler2 = this.wiki.getTiddler(this.actionTiddler);
				if (this.output === String(tiddler2.getFieldString(this.storeField))) {
				} else {
					this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
				}
			}
		}
	}
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ProdFieldWidget2.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	this.list = this.getTiddlerList();
	for (var i = 0; i < this.list.length; i++) {
		var output = 1;
		var tidtitle = this.list[i];
		var tiddler = this.wiki.getTiddler(tidtitle);
		if ( !isNaN(parseFloat(tiddler.getFieldString(this.prodField))) && isFinite(tiddler.getFieldString(this.prodField)) && !isNaN(parseFloat(tiddler.getFieldString(this.prodField2))) && isFinite(tiddler.getFieldString(this.prodField2)) ) {
	  		output = Number(tiddler.getFieldString(this.prodField)) * Number(tiddler.getFieldString(this.prodField2));
		}
		// Completely rerender if any of our attributes have changed
		if ( this.actionTiddler === 0 ) {
			if (String(output) != String(tiddler.getFieldString(this.storeField))) {
				this.refreshSelf();
				return true;
			} else if(this.stateTitle && changedTiddlers[this.stateTitle]) {
				this.readState();
				return true;
			}
		} else {
			var tiddler2 = this.wiki.getTiddler(this.actionTiddler);
			if (String(output) != String(tiddler2.getFieldString(this.storeField))) {
				this.refreshSelf();
				return true;
			} else if(this.stateTitle && changedTiddlers[this.stateTitle]) {
				this.readState();
				return true;
			}
		}
	}
	return false;
};

ProdFieldWidget2.prototype.getTiddlerList = function() {
	var defaultFilter = "[!is[system]is[system]]"; // this will always return an empty list and is always valid, so default behavior is to return an empty list
	return this.wiki.filterTiddlers(this.getAttribute("filter",defaultFilter),this);
};

exports.prodfield2 = ProdFieldWidget2;

})();
