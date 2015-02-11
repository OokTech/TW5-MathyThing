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
	sumFieldFull();

	// Reset the values when any of the tiddlers change
	$tw.wiki.addEventListener("change",function(changes) {
		//If the configuration changes do a full refresh, otherwise just refresh the changed expression
		if($tw.utils.hop(changes,CONFIGURATION_TIDDLER)) {
			sumFieldFull();
		} else {
			//Get the summation tag from the configuration tiddler
			var configurationTiddler1 = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
			var summationTag1 = configurationTiddler1.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
			//Build filter to make list of expression tiddlers
			var summationTiddlersFilter1 = "[tag["+summationTag1+"]!has[draft.of]]"; //somehow you get an infinite loop or something when you don't have the !has[draft.of] part, have more than one expression tiddler and try to edit one of the expression tiddlers
			//Evaluate the filter to get the list of expression tiddlers
			var expressionTiddlerList1 = $tw.wiki.filterTiddlers(summationTiddlersFilter1);
			//Iterate through the list of expression tidders and evaluate each one.
			if(expressionTiddlerList1.length != 0) {
				for (var i = 0; i < expressionTiddlerList1.length; i++) {
					var expressionTiddler1 = $tw.wiki.getTiddler(expressionTiddlerList1[i]);
					if(expressionTiddler1) {
						if($tw.utils.hop(changes,expressionTiddlerList1[i])) {
							sumField(expressionTiddler1);
						} else {
							var inputFilter1 = expressionTiddler1.getFieldString("sum_filter","[is[system]!is[system]]");
							var tiddlerList1 = $tw.wiki.filterTiddlers(inputFilter1);
							if(tiddlerList1.length != 0) {
								for (var i = 0; i < tiddlerList1.length; i++) {
									var tidtitle1 = tiddlerList1[i];
									if($tw.utils.hop(changes,tidtitle1)) {
										sumField(expressionTiddler1);
									}
								}
							}
						}
					}
				}
			}
		}
	});
};


function sumField(expressionTiddler) {
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
	  	output = defaultValue; //return the default value when there is nothing to sum
	} else {
	  	var output = 0;
	  	for (var i = 0; i < tiddlerList.length; i++) {
		    var tidtitle = tiddlerList[i];
		    var tiddler = $tw.wiki.getTiddler(tidtitle);
		    if(tiddler != undefined) {
			    if(!isNaN(parseFloat(tiddler.getFieldString(sumField))) && isFinite(tiddler.getFieldString(sumField))) {
		    		output = output + Number(tiddler.getFieldString(sumField));
				}
			}
	 	}
	}
	var checkTiddler = $tw.wiki.getTiddler(storeTiddler);
	if(checkTiddler && storeField) {
	    //If the output different than the current value, write the new value
		output = String(output);
		if(output != checkTiddler.getFieldString(storeField)) {
	  		$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
	  	}
  	}
};


function sumFieldFull() {
	//Get the summation tag from the configuration tiddler
	var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
	var summationTag = configurationTiddler.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
	//Build filter to make list of expression tiddlers
	var summationTiddlersFilter = "[tag["+summationTag+"]]";
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
				  	output = defaultValue; //return the default value when there is nothing to sum
				} else {
				  	var output = 0;
				  	for (var i = 0; i < tiddlerList.length; i++) {
					    var tidtitle = tiddlerList[i];
					    var tiddler = $tw.wiki.getTiddler(tidtitle);
					    if(tiddler != undefined) {
						    if(!isNaN(parseFloat(tiddler.getFieldString(sumField))) && isFinite(tiddler.getFieldString(sumField))) {
					    		output = output + Number(tiddler.getFieldString(sumField));
							}
						}
				 	}
				}
				var checkTiddler = $tw.wiki.getTiddler(storeTiddler);
				if(checkTiddler && storeField) {
				    //If the output different than the current value, write the new value
					output = String(output);
					if(output != checkTiddler.getFieldString(storeField)) {
				  		$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
				  	}
			  	}
			}
		}
	}
}

})();
