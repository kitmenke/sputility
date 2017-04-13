### Hyperlink
{{
// Get the hyperlink field
var hyperlinkField = SPUtility.GetSPField('Hyperlink Field');

// Set the field to link (shamelessly) to SPUtility.js on codeplex
hyperlinkField.SetValue('http://sputility.codeplex.com', 'SPUtility.js');

// Gets the value of the hyperlink field as an array
var values = hyperlinkField.GetValue();
// values[0](0) = 'http://sputility.codeplex.com'
// values[1](1) = 'SPUtility.js'

// Make the hyperlink field read only, displays as a clickable hyperlink
hyperlinkField.MakeReadOnly();
// also there is the ability to display the text only (no hyperlink)
// will display as "http://sputility.codeplex.com, SPUtility.js"
hyperlinkField.MakeReadOnly( { TextOnly: true } );

// Hide the field
hyperlinkField.Hide();
}}