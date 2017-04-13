### Version 0.14.2 (April 19, 2016)
* Corrected version number string in file header

### Version 0.14.1 (April 18, 2016)
* BUG: Fix empty Number fields displaying as NaN when in read only mode
* BUG: Fix date and time fields which have no date displaying the time only in read only mode

### Version 0.14.0 (March 30, 2016)
* FEATURE: Add ability to configure SPUtility.js with SPUtility.Setup(...)
* FEATURE: Allow customizing Yes/No field (SPBooleanField) string values. (Thank you szykov!)
* FEATURE: Improvement to SPUserField2013 to display links to users instead of just text. (Thank you szykov!)
* FEATURE: Allow getting the hashtable of all fields by internal name using SPUtility.GetSPFieldsInternal() (Thank you ViktorHofer!)
* DEPRECATED: The following functions will be removed in a future release: GetThousandsSeparator, SetThousandsSeparator, GetDecimalSeparator, SetDecimalSeparator, GetDateSeparator, SetDateSeparator, GetTimeFormat, and SetTimeFormat. Use SPUtility.Setup(...) instead!
* BUG: SPUserField2013 read only label should now be updated correctly if the value is changed.
* Huge refactoring of internal field creation. This helps especially for getting fields by their internal column name. (Thank you ViktorHofer!)

### Version 0.13.0 (March 22, 2016)
* FEATURE (or bug?): Support for different thousands and decimal separators using SetDecimalSeparator and SetThousandsSeparator (thank you ViktorHofer!)
* FEATURE: Full support for GetValue and SetValue on DispForm for fields which display as text (Text, Number, Date, most Choice fields, Yes/No) via a new class: SPDispFormTextFields. Note: 
* BUG: Fix detection of DispForm especially for document libraries. 
* BUG: Fix read-only label not updating for SP 2013 people fields (thank you ViktorHofer!)
* Added soooo many unit tests....

### Version 0.12.0 (February 28, 2016)
* BREAKING CHANGE: LabelRow and ControlsRow properties no longer return the jquery object but instead return the TR element itself.
* BUG: Fix Survey support in SharePoint 2013
* BUG: Fix MakeReadOnly method on people fields in SharePoint 2013
* FEATURE: Support for GetValue on DispForm via a new special type
* FEATURE: Add InternalName property to all fields (thank you RawkBob!)

### Version 0.11.2 (March 10, 2015)
* BUG / FEATURE: Date separator for date/time fields was hard coded to a '/'. Added a new function, SPUtility.SetDateSeparator, which allows the user to change it.
* BUG: SetDescription not working in SharePoint 2007

### Version 0.11.1 (February 26, 2015)
* BUG: Issue with getting current SharePoint version breaks the library

### Version 0.11.0 (February 23, 2015)
* FEATURE: Add GetDescription and SetDescription to SPField. Allows you to manipulate descriptions for any field type!
* FEATURE: Add SPFieldBusinessData
* BUG: More fixes for SharePoint 2007/2010 SPUserField
Big thanks to Onizet for the contributions! [https://sputility.codeplex.com/discussions/580446](https://sputility.codeplex.com/discussions/580446)

### Version 0.10.0 (February 12, 2015)
* FEATURE: Support for 24 hour time format with date and time fields!
* FEATURE: Support for people fields in SharePoint 2013!
* BUG: Fix spacing and padding with 12 hour time formats.
* BUG: Fix selectors in SPUserField (thanks onizet!)
* More examples added!

### Version 0.9.4 (November 9, 2014)
* BUG: Yes/No fields should display "Yes" or "No" instead of true or false after calling MakeReadOnly.
* BUG: Yes/No fields - SetValue not working correctly.

### Version 0.9.3 (September 29, 2014)
 * BUG: Checkbox fields should allow unchecking a field by passing a second boolean parameter set to false.

### Version 0.9.2 (July 1, 2014)
 * BUG: Should allow getting field names that are one character.

### Version 0.9.1 (May 8, 2014)
* FEATURE: Get fields using their internal column name: GetSPFieldByInternalName. See [Common SPField functions](Common-SPField-functions)
* FEATURE: DateTime fields now have two special methods: SetDate and SetTime. This allows you to set (or reset) the date or time individually. Also, both methods now support integer and string values! Also, calling GetValue will consistently return a SPDateTimeFieldValue object with integer properties for year, month, day, hour, and minute. See [Date fields](Date-fields)
* FEATURE/BUG: GetSPField now supports being able to retrieve the Content Type field see [Content Type fields](Content-Type-fields)

### Version 0.9.0 (April 2, 2014)
* BUG: Should be able to make mult-select lookup fields read-only (fixes #6).
* Refactored read-only methods to be class-level methods.
* CHANGE: Deprecate Debug mode (throw exceptions instead).
* BUG: Added HideSPField, ShowSPField, and GetSPFields public methods back.
* Refactored how global SPUtility variable is set(again).
* BUG: When a field is read-only, setting the value should update the label
* Added examples

### Version 0.8.4 (now with 100% more jQuery!!!) (March 4, 2014)
* Complete re-implementation of SPUtility using jQuery instead of prototype.js. 
* QUnit tests implemented for all of the fields
* Ability to clear a date field after it has been set by passing null
* Support for SharePoint 2013

**Prototype.js version discontinued and superseded by the jQuery version.**

### Version 0.8.2 (bug-fix update) (March 9, 2013):
* BUG: Fixed not being able to Hide fields on DispForm.aspx
* BUG: Fixed Large Lookup fields not saving value correctly (thank you lambi_uk!)
* BUG: Fixed not being able to call SetValue for Large Lookup fields when the value contained a space (thank you MarkETolley!)

### Version 0.8.1 (bug fix update) (April 23, 2012)
* BUG: Fixed problem with making empty date fields read only
* BUG: Fixed problem where setting the value of a read only field now didn't update the label
* FEATURE: Can now pass a string to a SPDateTimeField to set the date textbox

### Version 0.8 (April 26, 2011)
* FEATURE: Support for rich text fields
* FEATURE: Support for choice fields with fill-in values
* BUG: Support for unchecking multi-select checkboxes

### Version 0.7 (February 6, 2011)
* FEATURE: New SPLookupMultiField class to support multi-select lookup fields. Also various improvements to allow setting the values using list item ID or the text value for all Lookup fields.
* BUG: Fixed chaining after SetValue for single select lookup fields
* CHANGE: Refactored _makeReadOnly to be a private function

### Version 0.6 (January 31, 2011)
* FEATURE: SPUtility now can detect and load supported fields on Survey forms.
* FEATURE: New HideSPField and ShowSPField functions. These functions function the same as SPField.Hide/Show except the entire field won't be initialized. This can be useful on very large forms that only need to show/hide fields (ex: tabs).
* FEATURE: Debug function for troubleshooting: call SPUtility.Debug(true) before your SPUtility code to show alerts (firebug console messages if possible). 
* UPDATE: getSPFieldType optimized. 
* UPDATE: Fields are now initialized when GetSPField is called (not before).
* BUG: The function 'createSPField' no longer throws an error: problem where if a field had a problem, any fields after would not be detected.
* UPDATE: Updates to SPChoiceField to detect when the field allows for Fill-in values (partial support, currently can set the normal options but not Fill-in values yet)

### Version 0.5 (January 8, 2011)
* Bug: SPNumberField GetValue() function now disregards commas
* _Breaking change_: GetSPFields will now return a hashtable instead of the array (see next item)
* GetSPField now loads fields into a hashtable instead of an array (dramatically increases speed for forms with a large number of fields)
* GetSPFieldType now attempts to prevent throwing an error when unable to get the field's type (allows for easier Firebugging). 
* New MakeEditable function, will undo MakeReadOnly
* Support for currency fields. MakeReadOnly will display the value with dollar sign, and commas. Uses formatMoney function made by Jonas Raoni Soares Silva.
* Support for single select lookup fields
* Reformatted code to meet higher JSLint standards

### Version 0.4 (November 13, 2010)

* Bug: Unable to update the read only label. Fix allows developer to call MakeReadOnly again to update the label.
* Bug: Getting the value of a number field would sometimes return a string. GetValue now will always return a number.
* GetSPField now will throw a helpful error if the field is not found.
* Support for **plain text** "Multiple lines of text" fields (SPFieldNote). Support for the rich text versions is still a work in progress.
* Support for Yes/No fields. New SPBooleanField class for allows for getting and setting yes/no fields.

### Version 0.3 (September 26, 2010)

* Major performance enhancements when initially loading and getting fields
* New GetSPFields function to return all fields on the page
* Updates to the MakeReadOnly function. Now, it uses a div in order to space out the value and the field's description.
* Internal code updates:
	* Rename "Field" property to "Label"
	* Consolidated each class args into a single parameter object
* Support for People fields

### Version 0.2 (August 31, 2010)

* _Breaking change_: GetValue for Multi-select choice fields now returns an array of strings rather than a semicolon delimited list ({"["Alpha", "Bravo", "Charlie"](_Alpha_,-_Bravo_,-_Charlie_)"} vs "Alpha; Bravo; Charlie")
* Added the ability to Show/Hide any field (any type of field)
* Added GetValue, SetValue, MakeReadOnly support for the following field types:
	* Hyperlink (SPFieldURL)
	* Filename fields (default is the Name field in document libraries, aka SPFieldFile)
* Updated [Documentation](Documentation) with usage information for these fields

### Version 0.1 (August 19, 2010)

First release!

* GetValue, SetValue, MakeReadOnly, Hide and Show support for the following field types:
	* Single line of text
	* Date and Time (both "Date Only" and "Date & Time")
	* Number
	* Currency
	* Choice (single and multi-select choice fields)