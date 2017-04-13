### Description
Text fields are displayed as a textbox. They work similarly for each of these types:

* Single line of text
* Number
* Currency
* SPFieldFile (Document library "Name" field)

### Usage

See [Common SPField functions](Common-SPField-functions) for generic functions and properties.

#### Single line of text
{{
var field = SPUtility.GetSPField('Title');
field.SetValue('Hello world!');

// GetValue returns a string
var value = field.GetValue();
}}
#### Number
{{
var field = SPUtility.GetSPField('Number Field');
field.SetValue(42);

// GetValue returns a number
var value = field.GetValue();
}}
#### Currency
{{
var field = SPUtility.GetSPField('Currency Field');
field.SetValue('$97.95');

// GetValue returns a number (ex:  97.95)
var value = field.GetValue();

// GetFormattedValue returns a formatted string (ex: $97.95)
value = field.GetFormattedValue();
}}
#### SPFieldFile (Document library "Name" field)
{{
var field = SPUtility.GetSPField('Name');
field.SetValue('My Document Name');

// GetValue returns a string
var value = field.GetValue();
}}