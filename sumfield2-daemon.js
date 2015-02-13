/*\
title: $:/plugins/inmysocks/MathyThing/sumfield2-daemon.js
type: application/javascript
module-type: startup

Summation Daemon

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	// Export name and synchronous status
	exports.name = "sumfield2";
	exports.platforms = ["browser"];
	exports.after = ["startup"];
	exports.synchronous = true;

	// Configuration tiddler
	var CONFIGURATION_TIDDLER = "$:/plugins/inmysocks/MathyThing/MathyThingSettingsTiddler";

	exports.startup = function() {
		// Set values on startup
		sumField2Full();

		// Reset the values when any of the tiddlers change
		$tw.wiki.addEventListener("change",function(changes) {
			//If the configuration changes do a full refresh, otherwise just refresh the changed expression
			if($tw.utils.hop(changes, CONFIGURATION_TIDDLER)) {
				sumField2Full();
			} else {
				//Get the sumurn tag from the configuration tiddler
				var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
				var sum2Tag = configurationTiddler.getFieldString("sum2_tag"); // any tiddler with this tag will be an expression tiddler
				//Build filter to make list of expression tiddlers
				var sum2TiddlersFilter = "[tag[" + sum2Tag + "]evaluate[true]!has[draft.of]]"; //somehow you get an infinite loop or something when you don't have the !has[draft.of] part, have more than one expression tiddler and try to edit one of the expression tiddlers
				//Evaluate the filter to get the list of expression tiddlers
				var expressionTiddlerList = $tw.wiki.filterTiddlers(sum2TiddlersFilter);
				//Iterate through the list of expression tidders and evaluate each one.
				if(expressionTiddlerList.length !== 0) {
					for (var i = 0; i < expressionTiddlerList.length; i++) {
						var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
						if(expressionTiddler) {
							if($tw.utils.hop(changes,expressionTiddlerList[i])) {
								sumField2(expressionTiddler);
							} else {
								var inputFilter = expressionTiddler.getFieldString("sum2_filter","[is[system]!is[system]]");
								var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
								if(tiddlerList.length !== 0) {
									for (var j = 0; j < tiddlerList.length; j++) {
										var tidtitle = tiddlerList[j];
										if($tw.utils.hop(changes,tidtitle)) {
											sumField2(expressionTiddler);
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


	function sumField2(expressionTiddler) {
		//Get parameters for current tiddler
		var storeField = expressionTiddler.getFieldString("sum2_store_field");
		var storeIndex = expressionTiddler.getFieldString("sum2_store_index");
		var thisSumField = expressionTiddler.getFieldString("sum2_field");
		var thisSumField2 = expressionTiddler.getFieldString("sum2_field2");
		var defaultValue = expressionTiddler.getFieldString("sum2_default",1);
		var inputFilter = expressionTiddler.getFieldString("sum2_filter","[is[system]!is[system]]");
		var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
		// Check for an empty list, if the list isn't empty compute the sum
		if(tiddlerList.length === 0) {
			//Do nothing
		} else {
		  	for (var i = 0; i < tiddlerList.length; i++) {
			    var tidtitle = tiddlerList[i];
			    var tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(thisSumField))) && isFinite(tiddler.getFieldString(thisSumField)) && !isNaN(parseFloat(tiddler.getFieldString(thisSumField2))) && isFinite(tiddler.getFieldString(thisSumField2))) {
			    		var output = Number(tiddler.getFieldString(thisSumField2)) + Number(tiddler.getFieldString(thisSumField));
			    		writeOutput(tidtitle, storeField, storeIndex, output);
					} else {
						var output = defaultValue;
						writeOutput(tidtitle, storeField, storeIndex, output);
					}
				}
		 	}
		}
	}


	function sumField2Full() {
		//Get the sum tag from the configuration tiddler
		var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
		var sum2Tag = configurationTiddler.getFieldString("sum2_tag"); // any tiddler with this tag will be an expression tiddler
		//Build filter to make list of expression tiddlers
		var sum2TiddlersFilter = "[tag["+sum2Tag+"]]";
		//Evaluate the filter to get the list of expression tiddlers
		var expressionTiddlerList = $tw.wiki.filterTiddlers(sum2TiddlersFilter);
		//Iterate through the list of expression tidders and evaluate each one.
		if(expressionTiddlerList.length !== 0) {
			for (var i = 0; i < expressionTiddlerList.length; i++) {
				var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
				if(expressionTiddler) {
					sumField2(expressionTiddler);
				}
			}
		}
	}

	function writeOutput(storeTiddler, storeField, storeIndex, output) {
		var checkTiddler = $tw.wiki.getTiddler(storeTiddler);
		if(checkTiddler && storeField) {
			//If the output different than the current value, write the new value
			output = String(output);
			if(output != checkTiddler.getFieldString(storeField)) {
		  		$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
		  	}
	  	}
	}

})();
