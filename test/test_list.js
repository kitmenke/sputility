/* Tests specific to SharePoint lists */
(function($) {
   module("SPFieldDateTime (date and time)");

   test('Empty date field displays time in read only label #27', function() {
      expect(3);
      var field = SPUtility.GetSPField('Date and Time2');
      // field has no value set
      field.MakeReadOnly();
      strictEqual(field.ReadOnlyLabel.text(), "", "Read only label should be empty string.");
      field.SetValue(2013, 8, 15, '8 AM', '30');
      strictEqual(field.ReadOnlyLabel.text(), "8/15/2013 8:30 AM", "Read only label should be 8/15/2013 8:30 AM.");
      field.SetValue();
      strictEqual(field.ReadOnlyLabel.text(), "", "Read only label should be empty string.");
   });

   module("SPNumberField");

   test('Empty numeric field displays as NaN in read only label #28', function() {
      expect(3);
      var field = SPUtility.GetSPField('NumberEmpty');
      // field has no value set
      field.MakeReadOnly();
      strictEqual(field.ReadOnlyLabel.text(), "", "Read only label should be empty string.");
      field.SetValue(42);
      strictEqual(field.ReadOnlyLabel.text(), "42", "Read only label should be 42.");
      field.SetValue();
      strictEqual(field.ReadOnlyLabel.text(), "", "Read only label should be empty string.");
   });

   module("ContentTypeChoice", {
      setup: function() {
         this.field = SPUtility.GetSPField('Content Type');
      }
   });

   test("Get the field", function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "ContentTypeChoice", "The field's type should be " + this.field.Type);
   });

   test("Get and set the value", function() {
      expect(1);

      var expected = 'Item';
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   test("Get and set the value using content type id", function() {
      expect(1);

      var expected = 'Schedule and Reservations';
      this.field.SetValue('0x01020072BB2A38F0DB49C3A96CF4FA8552995600C75E64B08FECF44588B8BCA97362240C');

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   test("MakeReadOnly()", function() {
      expect(3);

      var expected = 'Reservations';
      this.field.SetValue('0x0102004F51EFDEA49C49668EF9C6744C8CF87D00107B364268BC6A4BB2FC37572DC79248');
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
          expected,
          "Validate SetValue() updates the read-only label.");
      strictEqual($(this.field.Controls).css('display'), "none");
      this.field.MakeEditable();
      ok($(this.field.Controls).css('display') !== "none");
   });

   module("SPURLField (hyperlink)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Hyperlink');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldURL", "The field's type should be " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(3);

      var expected = ['http://sputility.codeplex.com', 'SPUtility.js'];
      this.field.SetValue(expected[0], expected[1]);

      // make sure both textboxes were set correctly
      equal($('#Hyperlink_2ef372e5-47ae-4d20-89dd-5a43e5428ae6_UrlFieldUrl').val(), expected[0]);
      equal($('#Hyperlink_2ef372e5-47ae-4d20-89dd-5a43e5428ae6_UrlFieldDescription').val(), expected[1]);

      // Gets the value of the hyperlink field as an array
      var actual = this.field.GetValue();
      deepEqual(actual, expected,
              "GetValue() should return an array of two strings containing URL and Description.");
   });

   module("SPLookupMultiField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Multi-Priority Lookup Field');
      }
   });

   test('GetSPField()', function() {
      expect(6);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldLookupMulti", "Expected type is SPFieldLookupMulti");
      ok(this.field.ListChoices, "Expected to have a property named ListChoices");
      ok(this.field.ListSelections, "Expected to have a property named ListSelections");
      ok(this.field.ButtonAdd, "Expected to have a property named ButtonAdd");
      ok(this.field.ButtonRemove, "Expected to have a property named ButtonRemove");
   });

   module("SPLookupField (single-select, small lookup)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Small Lookup');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldLookup", "The field's type should be " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(2);

      var expected = 'Charlie';
      this.field.SetValue(expected);

      // make sure the select was set correctly
      equal($('#Small_x0020_Lookup_fc0ce102-b10d-48f1-bdce-760fd008eead_LookupField').val(), '3');

      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   module("SPLookupField (single-select, big lookup with autocomplete)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Large Lookup Field');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldLookup", "The field's type should be " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(2);

      var expected = 'Charlie';
      this.field.SetValue(expected);

      // make sure the select was set correctly
      equal($('#ctl00_m_g_a94984b1_b613_4db4_8e53_e809e1fc4a0b_ctl00_ctl04_ctl12_ctl00_ctl00_ctl04_ctl00_ctl01').val(), expected);

      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });


   module("SPUserField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Person or Group');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldUser", "The field's type should be " + this.field.Type);
   });

   /* Unable to test People fields locally
    * test("Correct properties are set", function() {
      expect(2);
      ok(this.field.ClientPeoplePicker, 'ClientPeoplePicker property not set');
      ok(this.field.EditorInput, 'EditorInput property not set');
   });*/

   module("Miscellaneous tests");

   test('Splitting autocomplete choices', function() {
      expect(1);

      // a list item ID was passed to the function so attempt to lookup the text value
      var choices = '(None)|0|A pipe || in the middle|31|AAA BBB CCC|30|Alpha|1|Bravo|2|Charlie|3|Delta|4|Echo|5|Foxtrot|6|Golf|7|Hotel|8|India|9|Juliet|10|Kilo|11|Lima|12|Mike|13|November|14|Oscar|15|Papa|16|Quebec|17|Romeo|18|Sierra|19|Tango|29';
      var expected = [
         "(None)",
         "0",
         "A pipe || in the middle",
         "31",
         "AAA BBB CCC",
         "30",
         "Alpha",
         "1",
         "Bravo",
         "2",
         "Charlie",
         "3",
         "Delta",
         "4",
         "Echo",
         "5",
         "Foxtrot",
         "6",
         "Golf",
         "7",
         "Hotel",
         "8",
         "India",
         "9",
         "Juliet",
         "10",
         "Kilo",
         "11",
         "Lima",
         "12",
         "Mike",
         "13",
         "November",
         "14",
         "Oscar",
         "15",
         "Papa",
         "16",
         "Quebec",
         "17",
         "Romeo",
         "18",
         "Sierra",
         "19",
         "Tango",
         "29"
      ];

      // split the string on every pipe character followed by a digit
      choices = choices.split(/\|(?=\d+)/);
      var c = [], pipeIndex;
      c.push(choices[0]);
      for (var i = 1; i < choices.length - 1; i++) {
         pipeIndex = choices[i].indexOf('|'); // split on the first pipe only
         c.push(choices[i].substring(0, pipeIndex));
         c.push(choices[i].substring(pipeIndex+1));
      }
      c.push(choices[choices.length-1]);

      deepEqual(c, expected);
   });
}(jQuery));
