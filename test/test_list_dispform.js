/* Tests specific to SharePoint lists */
(function() {

   module("SPDispFormTextField List Fields");

   /*
    * Generic test for SPDispFormTextFields
    * These fields should return a normal type, allow GetValue, and
    * SetValue.
    */
   function dispFormTextFieldTest(fieldName, fieldType, beforeExpected) {
      expect(5);

      var expected = 'foo bar', field = SPUtility.GetSPField(fieldName);
      notStrictEqual(field, null, "GetSPField should have returned an object.");
      strictEqual(field.Type, fieldType, "The field's type should be " + fieldType + ".");
      ok(field.TextNode, "The field should have a TextNode property.");
      strictEqual(field.GetValue(), beforeExpected, "The field's value should first be " + beforeExpected);

      field.SetValue(expected);
      strictEqual(field.GetValue(),
              expected,
              "SetValue should set the value to 'foo bar'.");
   }

   test("Text", function() { dispFormTextFieldTest('Title', 'SPFieldText', 'Alpha'); });
   test("Dropdown Choice", function() { dispFormTextFieldTest('Dropdown Choice', 'SPFieldChoice', 'Alpha'); });
   test("Dropdown Choice with Fill-in", function() { dispFormTextFieldTest('Dropdown Choice with Fill-in', 'SPFieldChoice', 'Alpha'); });
   test("Radio Buttons", function() { dispFormTextFieldTest('Radio Buttons', 'SPFieldChoice', 'Alpha'); });
   test("Radio Buttons with Fill-in", function() { dispFormTextFieldTest('Radio Buttons with Fill-in', 'SPFieldChoice', 'Alpha'); });
   test("Checkboxes", function() { dispFormTextFieldTest('Checkboxes', 'SPFieldMultiChoice', 'Alpha; Bravo; Charlie'); });
   test("Checkboxes with Fill-in", function() { dispFormTextFieldTest('Checkboxes with Fill-in', 'SPFieldMultiChoice', 'Alpha; Bravo; Charlie'); });
   test("Number", function() { dispFormTextFieldTest('Number', 'SPFieldNumber', '42'); });
   test("Currency", function() { dispFormTextFieldTest('Currency', 'SPFieldCurrency', '$99.95'); });
   test("Date Only", function() { dispFormTextFieldTest('Date Only', 'SPFieldDateTime', '3/5/2016'); });
   test("Date and Time", function() { dispFormTextFieldTest('Date and Time', 'SPFieldDateTime', '3/5/2016 4:45 PM'); });
   test("Yes/No", function() { dispFormTextFieldTest('Yes/No', 'SPFieldBoolean', 'No'); });

   // TODO: implement tests for SPDispFormField
   //test("Plain Text", function() { dispFormTextFieldTest('Multi-line Plain Text', 'SPFieldNote', 'Alpha hello world'); });
}(jQuery));
