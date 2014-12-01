/*\
title: $:/plugins/inymsocks/MathyThing/sumfield.js
type: application/javascript
module-type: widget

List and list item widgets

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

/*
The list widget creates list element sub-widgets that reach back into the list widget for their configuration
*/

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
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
SumFieldWidget.prototype.execute = function() {
	// Get attributes
	this.actionTiddler = this.getAttribute("tiddler");
	this.sumField = this.getAttribute("sumfield");
	this.storeField = this.getAttribute("storefield");
	this.storeIndex = this.getAttribute("index");
	// Compose the list elements
	this.list = this.getTiddlerList();
	// Check for an empty list
	if(this.list.length === 0) {
	  this.output = 0; //return 0 when there is nothing to sum
	} else {
	  var output = 0;
	  for (var i = 0; i < this.list.length; i++) {
	    var tidtitle = this.list[i];
	    var tiddler = this.wiki.getTiddler(tidtitle);
	    //var output = output + Number(this.list[i].getFieldString(this.sumField));
	    var output = output + Number(tiddler.getFieldString(this.sumField));
	  }
	  this.output = String(output);
	}
	this.wiki.setText(this.actionTiddler,this.storeField,this.storeIndex,this.output);
};

SumFieldWidget.prototype.getTiddlerList = function() {
	var defaultFilter = "[!is[system]is[system]]"; // this will always return an empty list and is always valid, so default behavior is to return an empty list
	return this.wiki.filterTiddlers(this.getAttribute("filter",defaultFilter),this);
};

/*
Compose the template for a list item
*/
SumFieldWidget.prototype.makeItemTemplate = function(title) {
	// Check if the tiddler is a draft
	var tiddler = this.wiki.getTiddler(title),
		isDraft = tiddler && tiddler.hasField("draft.of"),
		template = this.template,
		templateTree;
	if(isDraft && this.editTemplate) {
		template = this.editTemplate;
	}
	// Compose the transclusion of the template
	if(template) {
		templateTree = [{type: "transclude", attributes: {tiddler: {type: "string", value: template}}}];
	} else {
		if(this.parseTreeNode.children && this.parseTreeNode.children.length > 0) {
			templateTree = this.parseTreeNode.children;
		} else {
			// Default template is a link to the title
			templateTree = [{type: "element", tag: this.parseTreeNode.isBlock ? "div" : "span", children: [{type: "link", attributes: {to: {type: "string", value: title}}, children: [
					{type: "text", text: title}
			]}]}];
		}
	}
	// Return the list item
	return {type: "listitem", itemTitle: title, variableName: this.variableName, children: templateTree};
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
SumFieldWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Completely refresh if any of our attributes have changed
	if(changedAttributes.filter || changedAttributes.emptyMessage) {
		this.refreshSelf();
		return true;
	} else {
		// Handle any changes to the list
		var hasChanged = this.handleListChanges(changedTiddlers);
		return hasChanged;
	}
};

/*
Process any changes to the list
*/
SumFieldWidget.prototype.handleListChanges = function(changedTiddlers) {
	// Get the new list
	var prevList = this.list;
	this.list = this.getTiddlerList();
	// Check for an empty list
	if(this.list.length === 0) {
		// Check if it was empty before
		if(prevList.length === 0) {
			// If so, just refresh the empty message
			return this.refreshChildren(changedTiddlers);
		} else {
			// Replace the previous content with the empty message
			for(t=this.children.length-1; t>=0; t--) {
				this.removeListItem(t);
			}
			var nextSibling = this.findNextSiblingDomNode();
			this.makeChildWidgets(this.getEmptyMessage());
			this.renderChildren(this.parentDomNode,nextSibling);
			return true;
		}
	} else {
		// If the list was empty then we need to remove the empty message
		if(prevList.length === 0) {
			this.removeChildDomNodes();
			this.children = [];
		}
		// Cycle through the list, inserting and removing list items as needed
		var hasRefreshed = false;
		for(var t=0; t<this.list.length; t++) {
			var index = this.findListItem(t,this.list[t]);
			if(index === undefined) {
				// The list item must be inserted
				this.insertListItem(t,this.list[t]);
				hasRefreshed = true;
			} else {
				// There are intervening list items that must be removed
				for(var n=index-1; n>=t; n--) {
					this.removeListItem(n);
					hasRefreshed = true;
				}
				// Refresh the item we're reusing
				var refreshed = this.children[t].refresh(changedTiddlers);
				hasRefreshed = hasRefreshed || refreshed;
			}
		}
		// Remove any left over items
		for(t=this.children.length-1; t>=this.list.length; t--) {
			this.removeListItem(t);
			hasRefreshed = true;
		}
		return hasRefreshed;
	}
};

/*
Find the list item with a given title, starting from a specified position
*/
SumFieldWidget.prototype.findListItem = function(startIndex,title) {
	while(startIndex < this.children.length) {
		if(this.children[startIndex].parseTreeNode.itemTitle === title) {
			return startIndex;
		}
		startIndex++;
	}
	return undefined;
};

/*
Insert a new list item at the specified index
*/
SumFieldWidget.prototype.insertListItem = function(index,title) {
	// Create, insert and render the new child widgets
	var widget = this.makeChildWidget(this.makeItemTemplate(title));
	widget.parentDomNode = this.parentDomNode; // Hack to enable findNextSiblingDomNode() to work
	this.children.splice(index,0,widget);
	var nextSibling = widget.findNextSiblingDomNode();
	widget.render(this.parentDomNode,nextSibling);
	// Animate the insertion if required
	if(this.storyview && this.storyview.insert) {
		this.storyview.insert(widget);
	}
	return true;
};

/*
Remove the specified list item
*/
SumFieldWidget.prototype.removeListItem = function(index) {
	var widget = this.children[index];
	// Animate the removal if required
	if(this.storyview && this.storyview.remove) {
		this.storyview.remove(widget);
	} else {
		widget.removeChildDomNodes();
	}
	// Remove the child widget
	this.children.splice(index,1);
};

exports.sumfield = SumFieldWidget;

var ListItemWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ListItemWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ListItemWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
ListItemWidget.prototype.execute = function() {
	// Set the current list item title
	this.setVariable(this.parseTreeNode.variableName,this.parseTreeNode.itemTitle);
	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ListItemWidget.prototype.refresh = function(changedTiddlers) {
	return this.refreshChildren(changedTiddlers);
};

exports.listitem2 = ListItemWidget;

})();
