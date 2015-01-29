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
var CONFIGURATION_TIDDLER = "$:/plugins/inmysocks/MathyThing/MathyThingSettingsTiddler";

exports.startup = function() {

	// Set values on startup
	sumField();

	// Reset the values when any of the tiddlers change
	$tw.wiki.addEventListener("change",function(changes) {
		//Get the summation tag from the configuration tiddler
		var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
		var summationTag = configurationTiddler.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
		//Build filter to make list of expression tiddlers
		var summationTiddlersFilter = "[tag["+summationTag+"]!has[draft.of]]";
		//Evaluate the filter to get the list of expression tiddlers
		var expressionTiddlerList = $tw.wiki.filterTiddlers(summationTiddlersFilter);

		//Iterate through the list of expression tidders and evaluate each one.
		if(expressionTiddlerList.length != 0) {
			for (var i = 0; i < expressionTiddlerList.length; i++) {
				var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
				if(expressionTiddler) {
					var inputFilter = expressionTiddler.getFieldString("sum_filter","[is[system]!is[system]]");
					var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
					if(tiddlerList.length != 0) {
						for (var i = 0; i < tiddlerList.length; i++) {
							var tidtitle = tiddlerList[i];
							if($tw.utils.hop(changes,tidtitle)) {
								sumField(expressionTiddler);
							}
						}
					}
					if($tw.utils.hop(changes,CONFIGURATION_TIDDLER) || $tw.utils.hop(changes,expressionTiddlerList[i])) {
						sumField(expressionTiddler);
					}
				}
			}
		}
	});
};

function sumField(expressionTiddler) {
	//Get the summation tag from the configuration tiddler
	var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
	var summationTag = configurationTiddler.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
	//Build filter to make list of expression tiddlers
	var summationTiddlersFilter = "[tag["+summationTag+"]!has[draft.of]]";
	//Evaluate the filter to get the list of expression tiddlers
	var expressionTiddlerList = $tw.wiki.filterTiddlers(summationTiddlersFilter);

	//Iterate through the list of expression tidders and evaluate each one.
	if(expressionTiddlerList.length != 0) {
		for (var i = 0; i < expressionTiddlerList.length; i++) {
			var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
			if(expressionTiddler) {
				//Get parameters for current tiddler
				var storeTiddler = expressionTiddler.getFieldString("sum_store_tiddler");
				var storeField = expressionTiddler.getFieldString("sum_store_field");
				var storeIndex = expressionTiddler.getFieldString("sum_store_index");
				var sumField = expressionTiddler.getFieldString("sum_field");
				var inputFilter = expressionTiddler.getFieldString("sum_filter","[is[system]!is[system]]");
				var defaultValue = expressionTiddler.getFieldString("sum_default_value",0);
				var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
				// Check for an empty list, if the list isn't empty compute the sum
				if(tiddlerList.length === 0) {
				  	output = defaultValue; //return the default value when there is nothing to sum, if it isn't set than return 0
				} else {
				  	var output = 0;
				  	for (var i = 0; i < tiddlerList.length; i++) {
					    var tidtitle = tiddlerList[i];
					    var tiddler = $tw.wiki.getTiddler(tidtitle);
					    if(tiddler != undefined) {
						    if ( !isNaN(parseFloat(tiddler.getFieldString(sumField))) && isFinite(tiddler.getFieldString(sumField)) ) {
					    		output = output + Number(tiddler.getFieldString(sumField));
							}
						}
				 	}
				}
		        // If the sum has changed then write to the field
				output = String(output);
			  	$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
			}
		}
	}
};

})();
