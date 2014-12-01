TW5-MathyThing
==============

a math plugin for TiddlyWiki5

Currently this plugin contains:

==============

The action-storecount widget - an action widget with similar functionality as the count widget. It takes a filter and will count the number of matching tiddlers and store the output in the designated field. It was created by combining the action-setfield and count widgets.

Usage:

<$action-storecount $filter=<<someFilter>> $tiddler=someTiddler $field=someField/>

Since it is a modification of the action-setfield widget and I haven't modifed this part, you may be able to store the output at the given index of a data tiddler, but I haven't tested that yet.

==============

The sumfield widget - a widget that was made by modifying the list widget. It takes a filter and a given field and sums together everything in that field in the filtered tiddlers.

Usage:

<$sumfield filter=<<someFilter>> sumfield=sumField tiddler=storeTiddler storefield=storeField/>

It will take each tiddler listed when using <<someFilter>> and take the value in sumField from each of the tiddlers and sum them, the result will be placed in the storeField of the tiddler storeTiddler