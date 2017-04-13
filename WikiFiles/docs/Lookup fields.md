### Description
Lookup fields display in three modes depending on list settings and the number of lookup items:

* Small single select lookup
* Large single select lookup
* Multi select lookup

### Usage

See [Common SPField functions](Common-SPField-functions) for generic functions and properties.

#### Small single select lookup
This field displays as a dropdown using a SELECT when allow multiple values = No and there are less than 20 values in the lookup list.

{{
// get the field
var smallLookup = SPUtility.GetSPField('Small Lookup');

// set the value using the lookup list item's ID
smallLookup.SetValue(6);

// set the value using the text
smallLookup.SetValue('Indigo');

// Gets the dropdown's text value as a string (Ex: Indigo)
var value = smallLookup.GetValue();
}}This field has the Dropdown property set:
{{
var smallLookup = SPUtility.GetSPField('Small Lookup');

// Dropdown references the SELECT element for the field.
smallLookup.Dropdown;
}}
#### Large single select lookup
This field displays as an autocomplete using a text INPUT box when Allow multiple values = No, there are 20 or more values, and your browser is Internet Explorer. If a different browser is used, the field displays as a dropdown (will work like a small single select lookup).

{{
// get the field
var largeLookup = SPUtility.GetSPField('Large Lookup');

// set the value using the lookup list item's ID
largeLookup.SetValue(24);

// set the value using the text
largeLookup.SetValue('Xray');

// Gets the textbox's value as a string (Ex: Xray)
var value = smallLookup.GetValue();
}}This field has the Textbox property set:
{{
var largeLookup = SPUtility.GetSPField('Large Lookup');

// Textbox references the autocomplete INPUT element for the field.
largeLookup.Textbox;
}}
#### Multi-select lookup
This field displays as two list boxes with Add and Remove buttons when Allow multiple values = Yes.

{{
// get the field
var multiLookup = SPUtility.GetSPField('Multi-select Lookup');

// set the value using the lookup list item's ID
multiLookup.SetValue(7);

// set the value using the text
multiLookup.SetValue('Violet');

// to remove a value, add an additional parameter
multiLookup.SetValue(7, false);
multiLookup.SetValue('Violet', false);

// Gets the currently selected values as an array of strings (ex: [ 'Violet', 'Orange' ](-'Violet',-'Orange'-))
var value = smallLookup.GetValue();
}}This field has four additional properties set:
{{
var largeLookup = SPUtility.GetSPField('Large Lookup');

// ListChoices references the SELECT element of values that can be added
largeLookup.ListChoices;

// ListSelections references the SELECT element of values that can be removed (the current selections)
largeLookup.ListSelections;

// ButtonAdd references the BUTTON element to add items
largeLookup.ButtonAdd;

// ButtonRemove references the BUTTON element to remove items
largeLookup.ButtonRemove;
}}
