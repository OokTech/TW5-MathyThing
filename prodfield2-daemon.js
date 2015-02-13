/*\
title: $:/plugins/inmysocks/MathyThing/prodfield2-daemon.js
type: application/javascript
module-type: startup

Summation Daemon

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	// Export name and synchronous status
	exports.name = "prodfield2";
	exports.platforms = ["browser"];
	exports.after = ["startup"];
	exports.synchronous = true;

	// Configuration tiddler
	var CONFIGURATION_TIDDLER = "$:/plugins/inmysocks/MathyThing/MathyThingSettingsTiddler";

	exports.startup = function() {
		// Set values on startup
		prodField2Full();

		// Reset the values when any of the tiddlers change
		$tw.wiki.addEventListener("change",function(changes) {
			//If the configuration changes do a full refresh, otherwise just refresh the changed expression
			if($tw.utils.hop(changes, CONFIGURATION_TIDDLER)) {
				prodField2Full();
			} else {
				//Get the produrn tag from the configuration tiddler
				var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
				var prod2Tag = configurationTiddler.getFieldString("prod2_tag"); // any tiddler with this tag will be an expression tiddler
				//Build filter to make list of expression tiddlers
				var prod2TiddlersFilter = "[tag[" + prod2Tag + "]evaluate[true]!has[draft.of]]"; //somehow you get an infinite loop or something when you don't have the !has[draft.of] part, have more than one expression tiddler and try to edit one of the expression tiddlers
				//Evaluate the filter to get the list of expression tiddlers
				var expressionTiddlerList = $tw.wiki.filterTiddlers(prod2TiddlersFilter);
				//Iterate through the list of expression tidders and evaluate each one.
				if(expressionTiddlerList.length !== 0) {
					for (var i = 0; i < expressionTiddlerList.length; i++) {
						var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
						if(expressionTiddler) {
							if($tw.utils.hop(changes,expressionTiddlerList[i])) {
								prodField2(expressionTiddler);
							} else {
								var inputFilter = expressionTiddler.getFieldString("prod2_filter","[is[system]!is[system]]");
								var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
								if(tiddlerList.length !== 0) {
									for (var j = 0; j < tiddlerList.length; j++) {
										var tidtitle = tiddlerList[j];
										if($tw.utils.hop(changes,tidtitle)) {
											prodField2(expressionTiddler);
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


	function prodField2(expressionTiddler) {
		//Get parameters for current tiddler
		var storeField = expressionTiddler.getFieldString("prod2_store_field");
		var storeIndex = expressionTiddler.getFieldString("prod2_store_index");
		var thisProdField = expressionTiddler.getFieldString("prod2_field");
		var thisProdField2 = expressionTiddler.getFieldString("prod2_field2");
		var defaultValue = expressionTiddler.getFieldString("prod2_default",1);
		var inputFilter = expressionTiddler.getFieldString("prod2_filter","[is[system]!is[system]]");
		var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
		// Check for an empty list, if the list isn't empty compute the prod
		if(tiddlerList.length === 0) {
			//Do nothing
		} else {
		  	for (var i = 0; i < tiddlerList.length; i++) {
			    var tidtitle = tiddlerList[i];
			    var tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(thisProdField))) && isFinite(tiddler.getFieldString(thisProdField)) && !isNaN(parseFloat(tiddler.getFieldString(thisProdField2))) && isFinite(tiddler.getFieldString(thisProdField2))) {
			    		var output = Number(tiddler.getFieldString(thisProdField2)) * Number(tiddler.getFieldString(thisProdField));
			    		writeOutput(tidtitle, storeField, storeIndex, output);
					} else {
						var output = defaultValue;
						writeOutput(tidtitle, storeField, storeIndex, output);
					}
				}
		 	}
		}
	}


	function prodField2Full() {
		//Get the product tag from the configuration tiddler
		var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
		var prod2Tag = configurationTiddler.getFieldString("prod2_tag"); // any tiddler with this tag will be an expression tiddler
		//Build filter to make list of expression tiddlers
		var prod2TiddlersFilter = "[tag["+prod2Tag+"]]";
		//Evaluate the filter to get the list of expression tiddlers
		var expressionTiddlerList = $tw.wiki.filterTiddlers(prod2TiddlersFilter);
		//Iterate through the list of expression tidders and evaluate each one.
		if(expressionTiddlerList.length !== 0) {
			for (var i = 0; i < expressionTiddlerList.length; i++) {
				var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
				if(expressionTiddler) {
					prodField2(expressionTiddler);
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
