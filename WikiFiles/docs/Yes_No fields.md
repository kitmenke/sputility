### Yes/No (boolean)
{{
// Get the "Is important?" field
var myBoolField = SPUtility.GetSPField('Is important?');

// Set the field to "yes" (checked)
myBoolField.SetValue(true);
// Set the field to "no" (not checked)
myBoolField.SetValue(false);

// Get the value: true or false
var value = myBoolField.GetValue();

// Make the field read only
myBoolField.MakeReadOnly();

// Allow the user to edit the field again
myBoolField.MakeEditable();

// Hide the field
myBoolField.Hide();
}}