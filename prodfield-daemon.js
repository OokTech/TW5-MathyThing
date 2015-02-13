/*\
title: $:/plugins/inmysocks/MathyThing/prodfield-daemon.js
type: application/javascript
module-type: startup

Summation Daemon

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	// Export name and synchronous status
	exports.name = "prodfield";
	exports.platforms = ["browser"];
	exports.after = ["startup"];
	exports.synchronous = true;

	// Configuration tiddler
	var CONFIGURATION_TIDDLER = "$:/plugins/inmysocks/MathyThing/MathyThingSettingsTiddler";

	exports.startup = function() {
		// Set values on startup
		prodFieldFull();

		// Reset the values when any of the tiddlers change
		$tw.wiki.addEventListener("change",function(changes) {
			//If the configuration changes do a full refresh, otherwise just refresh the changed expression
			if($tw.utils.hop(changes, CONFIGURATION_TIDDLER)) {
				prodFieldFull();
			} else {
				//Get the produrn tag from the configuration tiddler
				var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
				var prodTag = configurationTiddler.getFieldString("prod_tag"); // any tiddler with this tag will be an expression tiddler
				//Build filter to make list of expression tiddlers
				var prodTiddlersFilter = "[tag[" + prodTag + "]evaluate[true]!has[draft.of]]"; //somehow you get an infinite loop or something when you don't have the !has[draft.of] part, have more than one expression tiddler and try to edit one of the expression tiddlers
				//Evaluate the filter to get the list of expression tiddlers
				var expressionTiddlerList = $tw.wiki.filterTiddlers(prodTiddlersFilter);
				//Iterate through the list of expression tidders and evaluate each one.
				if(expressionTiddlerList.length !== 0) {
					for (var i = 0; i < expressionTiddlerList.length; i++) {
						var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
						if(expressionTiddler) {
							if($tw.utils.hop(changes,expressionTiddlerList[i])) {
								prodField(expressionTiddler);
							} else {
								var inputFilter = expressionTiddler.getFieldString("prod_filter","[is[system]!is[system]]");
								var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
								if(tiddlerList.length !== 0) {
									for (var j = 0; j < tiddlerList.length; j++) {
										var tidtitle = tiddlerList[j];
										if($tw.utils.hop(changes,tidtitle)) {
											prodField(expressionTiddler);
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


	function prodField(expressionTiddler) {
		//Get parameters for current tiddler
		var storeTiddler = expressionTiddler.getFieldString("prod_store_tiddler");
		var storeField = expressionTiddler.getFieldString("prod_store_field");
		var storeIndex = expressionTiddler.getFieldString("prod_store_index");
		var thisSumField = expressionTiddler.getFieldString("prod_field");
		var inputFilter = expressionTiddler.getFieldString("prod_filter","[is[system]!is[system]]");
		var defaultValue = expressionTiddler.getFieldString("prod_default_value",0);
		var createTiddler = expressionTiddler.getFieldString("create",0);
		var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
    	var output;
		// Check for an empty list, if the list isn't empty compute the prod
		if(tiddlerList.length === 0) {
		  	output = defaultValue; //return the default value when there is nothing to prod
		  	writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler);
		} else {
		  	output = 1;
		  	for (var i = 0; i < tiddlerList.length; i++) {
			    var tidtitle = tiddlerList[i];
			    var tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(thisSumField))) && isFinite(tiddler.getFieldString(thisSumField))) {
			    		output = output * Number(tiddler.getFieldString(thisSumField));
			    		writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler);
					}
				}
		 	}
		}
	}


	function prodFieldFull() {
		//Get the product tag from the configuration tiddler
		var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
		var prodTag = configurationTiddler.getFieldString("prod_tag"); // any tiddler with this tag will be an expression tiddler
		//Build filter to make list of expression tiddlers
		var prodTiddlersFilter = "[tag["+prodTag+"]]";
		//Evaluate the filter to get the list of expression tiddlers
		var expressionTiddlerList = $tw.wiki.filterTiddlers(prodTiddlersFilter);
		//Iterate through the list of expression tidders and evaluate each one.
		if(expressionTiddlerList.length !== 0) {
			for (var i = 0; i < expressionTiddlerList.length; i++) {
				var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
				if(expressionTiddler) {
					prodField(expressionTiddler);
				}
			}
		}
	}

	function writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler) {
		if(createTiddler && storeField) {
			$tw.wiki.setText(storeTiddler,storeField,storeIndex,output);
		} else {
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

})();
