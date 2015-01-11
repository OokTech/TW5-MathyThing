/*\
title: $:/plugins/inmysocks/MathyThing/sumfield-daemon.js
type: application/javascript
module-type: startup

Summation Daemon

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "sumfield";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;
		
// Favicon tiddler
var CONFIGURATION_TIDDLER = "Summation Daemon Configuration";
var EXPRESSION_TIDDLER = "Expression Tiddler";

exports.startup = function() {
/*
	//Get the summation tag from the configuration tiddler
	var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
	var summationTag = configurationTiddler.getFieldString("summation_tag")

	//Build filter to make list of expression tiddlers

	//Evaluate the filter to get the list of expression tiddlers
	var tiddlerList = $tw.wiki.filterTiddlers(summationTiddlersFilter);
*/
	// Set values on startup
	sumField();

	// Reset the values when any of the tiddlers change
	$tw.wiki.addEventListener("change",function(changes) {
		var expressionTiddler = $tw.wiki.getTiddler(EXPRESSION_TIDDLER);
		if( expressionTiddler ) {
			var inputFilter = expressionTiddler.getFieldString("filter","[is[system]!is[system]]");
			var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
			if(tiddlerList.length != 0) {
				for (var i = 0; i < tiddlerList.length; i++) {
					var tidtitle = tiddlerList[i];
					if($tw.utils.hop(changes,tidtitle)) {
						sumField();
					}
				}
			}
			if($tw.utils.hop(changes,CONFIGURATION_TIDDLER) || $tw.utils.hop(changes,EXPRESSION_TIDDLER)) {
				sumField();
			}
		}
	});
};

function sumField() {
	var configTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
	var expressionTiddler = $tw.wiki.getTiddler(EXPRESSION_TIDDLER);
	if(configTiddler && expressionTiddler) {
		var storeTiddler = expressionTiddler.getFieldString("store_tiddler");
		var storeField = expressionTiddler.getFieldString("store_field");
		var storeIndex = expressionTiddler.getFieldString("store_index");
		var sumField = expressionTiddler.getFieldString("sum_field");
		var inputFilter = expressionTiddler.getFieldString("filter","[is[system]!is[system]]");
		var defaultValue = expressionTiddler.getFieldString("default_value",0);

		var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);

		console.log(tiddlerList);

		// Check for an empty list, if the list isn't empty compute the sum
		if(tiddlerList.length === 0) {
		  output = defaultValue; //return the default value when there is nothing to sum, if it isn't set than return 0
		} else {
		  var output = 0;
		  for (var i = 0; i < tiddlerList.length; i++) {
		    var tidtitle = tiddlerList[i];
		    var tiddler = $tw.wiki.getTiddler(tidtitle);
		    console.log(tiddler);
		    if ( !isNaN(parseFloat(tiddler.getFieldString(sumField))) && isFinite(tiddler.getFieldString(sumField)) ) {
		    	output = output + Number(tiddler.getFieldString(sumField));
		    	console.log(output);
			}
		  }
		}
        // If the sum has changed then write to the field
		output = String(output);
		console.log(storeTiddler);
		console.log(storeField);
		console.log(output);
	  	$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
	}
};

})();
