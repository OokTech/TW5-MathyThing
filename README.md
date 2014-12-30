!TW5-MathyThing


a math plugin for TiddlyWiki5

Currently this plugin contains:

---

''The action-storecount widget'' - an action widget with similar functionality as the count widget. It takes a filter and will count the number of matching tiddlers and store the output in the designated field. It was created by combining the action-setfield and count widgets.

Usage:

`<$action-storecount $filter=<<someFilter>> $tiddler=someTiddler $field=someField/>`

Since it is a modification of the action-setfield widget and I haven't modifed this part, you may be able to store the output at the given index of a data tiddler, but I haven't tested that yet.

---


''The sumfield widget'' - a widget that was made by modifying the list widget. It takes a filter and a given field and sums together everything in that field in the filtered tiddlers.

Usage:

`<$sumfield filter=<<someFilter>> sumfield=sumField tiddler=storeTiddler storefield=storeField defaultvalue=defaultValue/>`

It will take each tiddler listed when using `<<someFilter>>` and take the value in sumField from each of the tiddlers and sum them, the result will be placed in the storeField of the tiddler storeTiddler. If there aren't any numbers to sum than it will display defaultValue.

tiddler defaults to `<<currentTiddler>>` and defaultValue defaults to 0 if they aren't given inputs.

If one of the fields contains a non-numeric value than it is ignored. This includes empty fields.

---


''The sumfield2 widget'' - a widget that was made by modifying the list widget. It takes a filter and a given field and sums together two fields in the filtered tiddlers and stores the value in a third field.

Usage:

`<$sumfield2 filter=<<someFilter>> sumfield=sumField sumfield2=sumField2 storefield=storeField defaultvalue=defaultValue/>`

It will take each tiddler listed when using `<<someFilter>>` and take the value in sumField to the value in sumField2 in each of the tiddlers and the result will be placed in the storeField of each tiddler. If there aren't any numbers to sum than it will display defaultValue.

tiddler defaults to `<<currentTiddler>>` and defaultValue defaults to 0 if they aren't given inputs.

If one of the fields contains a non-numeric value than it is ignored. This includes empty fields.

---


''The prodfield widget'' - a widget that was made by modifying the list widget. It takes a filter and a given field and takes the product of everything in that field in the filtered tiddlers.

Usage:

`<$prodfield filter=<<someFilter>> prodfield=prodField tiddler=storeTiddler storefield=storeField defaultvalue=defaultValue/>`

It will take each tiddler listed when using `<<someFilter>>` and take the value in prodField from each of the tiddlers and take their product, the result will be placed in the storeField of the tiddler storeTiddler. If there aren't any numbers to sum than it will display defaultValue. 

tiddler defaults to `<<currentTiddler>>` and defaultValue defaults to 0 if they aren't given inputs.

If one of the fields contains a non-numeric value than it is ignored. This includes empty fields.

---


''The prodfield2 widget'' - a widget that was made by modifying the list widget. It takes a filter and a given two fields takes the product of those fields in the filtered tiddlers, then stores the result in a third field in each tiddler.

Usage:

`<$prodfield2 filter=<<someFilter>> prodfield=prodField prodfield2=prodField2 storefield=storeField defaultvalue=defaultValue/>`

It will take each tiddler listed when using `<<someFilter>>` and multiply the values in prodField and prodField2 in each of the tiddlers and the result will be placed in the storeField of each tiddler. If there aren't any numbers to sum than it will display defaultValue. 

tiddler defaults to `<<currentTiddler>>` and defaultValue defaults to 0 if they aren't given inputs.

If one of the fields contains a non-numeric value than it is ignored. This includes empty fields.