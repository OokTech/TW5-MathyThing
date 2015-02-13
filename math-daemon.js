/*\
title: $:/plugins/inmysocks/MathyThing/math-daemon.js
type: application/javascript
module-type: startup

Summation Daemon

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	// Export name and synchronous status
	exports.name = "math-daemon";
	exports.platforms = ["browser"];
	exports.after = ["startup"];
	exports.synchronous = true;

	// Configuration tiddler
	var CONFIGURATION_TIDDLER = "$:/plugins/inmysocks/MathyThing/MathyThingSettingsTiddler";

	exports.startup = function() {
		// Set values on startup
		sumFieldFull();
		sumField2Full();
		prodFieldFull();
		prodField2Full();

		// Reset the values when any of the tiddlers change
		$tw.wiki.addEventListener("change",function(changes) {
			//If the configuration changes do a full refresh, otherwise just refresh the changed expression
			if($tw.utils.hop(changes, CONFIGURATION_TIDDLER)) {
				sumFieldFull();
				sumField2Full();
				prodFieldFull();
				prodField2Full();
			} else {
				//Get the sumurn tag from the configuration tiddler
				var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
				var sumTag = configurationTiddler.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
				var sum2Tag = configurationTiddler.getFieldString("sum2_tag"); // any tiddler with this tag will be an expression tiddler
				var prodTag = configurationTiddler.getFieldString("prod_tag"); // any tiddler with this tag will be an expression tiddler
				var prod2Tag = configurationTiddler.getFieldString("prod2_tag"); // any tiddler with this tag will be an expression tiddler
				var tags = [sumTag, sum2Tag, prodTag, prod2Tag];
				var filterStringField = ["sum_filter", "sum2_filter", "prod_filter", "prod2_filter"];

				for (var i = 0; i<4; i++) {
					console.log(tags[i]);
					var tiddlersFilter = "[tag[" + tags[i] + "]evaluate[true]!has[draft.of]]";
					var expressionTiddlerList = $tw.wiki.filterTiddlers(tiddlersFilter);
					//Iterate through the list of expression tidders and evaluate each one.
					if(expressionTiddlerList.length !== 0) {
						for (var j = 0; j < expressionTiddlerList.length; j++) {
							var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[j]);
							if(expressionTiddler) {
								if($tw.utils.hop(changes,expressionTiddlerList[j])) {
									evaluateExpression(expressionTiddler, i);
								} else {
									var inputFilter = expressionTiddler.getFieldString(filterStringField[i] ,"[is[system]!is[system]]");
									console.log(inputFilter);
									var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
									if(tiddlerList.length !== 0) {
										for (var k = 0; k < tiddlerList.length; k++) {
											var tidTitle = tiddlerList[k];
											if($tw.utils.hop(changes,tidTitle)) {
												evaluateExpression(expressionTiddler, i);
											}
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

	function evaluateExpression(expressionTiddler, index) {
		console.log(index);
		var storeTiddler;
		var storeField;
		var storeIndex;
		var inputField1;
		var inputField2;
		var inputFilter;
		var defaultValue;
		var createTiddler;

		var storeTiddlerField = ["sum_store_tiddler", "", "prod_store_tiddler", ""];
		var storeFieldField = ["sum_store_field", "sum2_store_field", "prod_store_field", "prod2_store_field"];
		var storeIndexField = ["sum_store_index", "sum2_store_index", "prod_store_index", "prod2_store_index"];
		var inputField1Field = ["sum_field", "sum2_field", "prod_field", "prod2_field"];
		var inputField2Field = ["", "sum2_field2", "", "prod2_field2"];
		var inputFilterField = ["sum_filter", "sum2_filter", "prod_filter", "prod2_filter"];
		var defaultValueField = ["sum_default_value", "sum2_default", "prod_default_value", "prod2_default"];
		var createTiddlerField = ["create", "", "create", ""];

		storeTiddler = expressionTiddler.getFieldString(storeTiddlerField[index]);
		storeField = expressionTiddler.getFieldString(storeFieldField[index]);
		storeIndex = expressionTiddler.getFieldString(storeIndexField[index]);
		inputField1 = expressionTiddler.getFieldString(inputField1Field[index]);
		inputField2 = expressionTiddler.getFieldString(inputField2Field[index]);
		inputFilter = expressionTiddler.getFieldString(inputFilterField[index]);
		defaultValue = expressionTiddler.getFieldString(defaultValueField[index]);
		createTiddler = expressionTiddler.getFieldString(createTiddlerField[index]);

		var tiddlerList = $tw.wiki.filterTiddlers(inputFilter);
		var output;
		var tiddler;
		var tidtitle;
		if(tiddlerList.length === 0) {
			  	output = defaultValue; //return the default value when there is nothing to sum
			  	console.log(output);
			  	writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler);
		} else if (index===0) { 
			  	output = 0;
			  	for (var i = 0; i < tiddlerList.length; i++) {
			    tidtitle = tiddlerList[i];
			    tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(inputField1))) && isFinite(tiddler.getFieldString(inputField1))) {
			    		output = output + Number(tiddler.getFieldString(inputField1));
			    		console.log(output);
			    		writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler);
					}
				}
		 	}
		} else if (index===1) {
		  	for (var j = 0; j < tiddlerList.length; j++) {
			    tidtitle = tiddlerList[j];
			    tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(inputField1))) && isFinite(tiddler.getFieldString(inputField1)) && !isNaN(parseFloat(tiddler.getFieldString(inputField2))) && isFinite(tiddler.getFieldString(inputField2))) {
			    		output = Number(tiddler.getFieldString(inputField2)) + Number(tiddler.getFieldString(inputField1));
			    		console.log(output);
			    		writeOutput(tidtitle, storeField, storeIndex, output);
					} else {
						output = defaultValue;
						console.log(output);
						writeOutput(tidtitle, storeField, storeIndex, output);
					}
				}
		 	}
		} else if (index===2) {
		  	output = 1;
		  	for (var k = 0; k < tiddlerList.length; k++) {
			    tidtitle = tiddlerList[k];
			    tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(inputField1))) && isFinite(tiddler.getFieldString(inputField1))) {
			    		output = output * Number(tiddler.getFieldString(inputField1));
			    		console.log(output);
			    		writeOutput(storeTiddler, storeField, storeIndex, output, createTiddler);
					}
				}
		 	}
		} else if (index===3) {
		  	for (var l = 0; l < tiddlerList.length; l++) {
			    tidtitle = tiddlerList[l];
			    tiddler = $tw.wiki.getTiddler(tidtitle);
			    if(tiddler !== undefined) {
				    if(!isNaN(parseFloat(tiddler.getFieldString(inputField1))) && isFinite(tiddler.getFieldString(inputField1)) && !isNaN(parseFloat(tiddler.getFieldString(inputField2))) && isFinite(tiddler.getFieldString(inputField2))) {
			    		output = Number(tiddler.getFieldString(inputField2)) * Number(tiddler.getFieldString(inputField1));
			    		console.log(output);
			    		writeOutput(tidtitle, storeField, storeIndex, output);
					} else {
						output = defaultValue;
						console.log(output);
						writeOutput(tidtitle, storeField, storeIndex, output);
					}
				}
		 	}
		}
	}

	function sumFieldFull() {
		//Get the summation tag from the configuration tiddler
		var configurationTiddler = $tw.wiki.getTiddler(CONFIGURATION_TIDDLER);
		var summationTag = configurationTiddler.getFieldString("sum_tag"); // any tiddler with this tag will be an expression tiddler
		//Build filter to make list of expression tiddlers
		var summationTiddlersFilter = "[tag["+summationTag+"]]";
		//Evaluate the filter to get the list of expression tiddlers
		var expressionTiddlerList = $tw.wiki.filterTiddlers(summationTiddlersFilter);
		//Iterate through the list of expression tidders and evaluate each one.
		if(expressionTiddlerList.length !== 0) {
			for (var i = 0; i < expressionTiddlerList.length; i++) {
				var expressionTiddler = $tw.wiki.getTiddler(expressionTiddlerList[i]);
				if(expressionTiddler) {
					evaluateExpression(expressionTiddler, 0);
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
					evaluateExpression(expressionTiddler, 1);
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
					evaluateExpression(expressionTiddler, 2);
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
					evaluateExpression(expressionTiddler, 3);
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
