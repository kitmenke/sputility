(function($) {
   /*
    * For testing integration with SharePoint 2013
    */

   module("Main");

   test("The static function to get SPFields is available.", function() {
      ok(SPUtility.GetSPField);
      ok($);
   });

   test("SPField throws an error when the field was not found.", function() {
      throws(
              function() {
                 SPUtility.GetSPField('foo bar');
              },
              "Unable to get a SPField named foo bar",
              "Correct error was thrown"
              );
   });

   module("SPTextField", {
      setup: function() {
         this.textboxId = 'Title_fa564e0f-0c70-4ab9-b863-0177e6ddd247_$TextField';
         this.field = SPUtility.GetSPField('Title');
      }
   });

   test("Get the field", function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldText", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Textbox.id,
              this.textboxId,
              "Textbox property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("Get and set the value", function() {
      expect(1);

      var expected = 'foo bar';
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   test("Make field read only then make it editable again", function() {
      expect(2);

      var expected = 'foo bar';
      this.field.SetValue(expected);
      this.field.MakeReadOnly();
      strictEqual($(this.field.Controls).css('display'), "none");
      this.field.MakeEditable();
      strictEqual($(this.field.Controls).css('display'), "inline");
   });

   module("SPNumberField", {
      setup: function() {
         this.textboxId = 'Number_4010b3fc-1225-4f57-a2f5-64f4aa176617_$NumberField';
         this.field = SPUtility.GetSPField('Number');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNumber", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Textbox.id,
              this.textboxId,
              "Textbox property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = 42;
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   module("SPCurrencyField", {
      setup: function() {
         this.textboxId = 'Currency_e09d0410-2dee-4218-9829-ae4a97f5cbaa_$CurrencyField';
         this.field = SPUtility.GetSPField('Currency');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldCurrency", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Textbox.id,
              this.textboxId,
              "Textbox property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = 42;
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   module("SPFieldChoice - Dropdown", {
      setup: function() {
         this.dropdownId = 'Dropdown_x0020_Choice_23d12dec-bc26-4ae1-91aa-df5059fb2bbf_$DropDownChoice';
         this.field = SPUtility.GetSPField('Dropdown Choice');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Dropdown.id,
              this.dropdownId,
              "Textbox property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = "Charlie";
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });
   
   test("Try setting the field to garbage (throws an exception)", function() {
      expect(1);
      
      throws(function(){
         this.field.SetValue("foo bar");
      });
   });
   
   module("SPFieldChoice Dropdown (with fill in)", {
      setup: function() {
         this.dropdownId = 'Dropdown_x0020_Choice_x0020_with_3463524b-46aa-4421-949b-e1559a0d9884_$DropDownChoice';
         this.field = SPUtility.GetSPField('Dropdown Choice with Fill-in');
      }
   });

   test('GetSPField()', function() {
      expect(5);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      notStrictEqual(this.field.FillInElement, null, "Fill in element should have an element.");
      strictEqual(this.field.FillInAllowed, true, "Fill in should be allowed.");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Dropdown.id,
              this.dropdownId,
              "Textbox property is not set or is set to the wrong to the wrong DOM object.");

   });

   test("SetValue() and GetValue()", function() {
      expect(2);

      var expected = "Charlie";
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set dropdown.");

      expected = "foo bar";
      this.field.SetValue(expected);
      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set fill in value.");
   });
   
   module("SPFieldChoice - Radio buttons", {
      setup: function() {
         this.field = SPUtility.GetSPField('Radio Buttons');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.RadioButtons.length,
              5,
              "RadioButtons property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = "Charlie";
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Radio button.");
   });
   
   test("Try setting the field to garbage (throws an exception)", function() {
      expect(1);
      
      throws(function(){
         this.field.SetValue("foo bar");
      });
   });
   
   module("SPFieldChoice - Radio buttons with fill-in", {
      setup: function() {
         this.field = SPUtility.GetSPField('Radio Buttons with Fill-in');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.RadioButtons.length,
              3,
              "RadioButtons property is not set or is set to the wrong to the wrong DOM object.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = "Charlie";
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Radio button.");
   });
   
   test("Set the fill-in value", function() {
      expect(2);
      
      var expected = "foo bar";
      this.field.SetValue(expected);
      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Radio fill-in choice.");
      strictEqual($(this.field.FillInTextbox).val(),
         expected,
         "Expect the fill-in textbox to be set correctly.");
   });

   module("SPFieldChoice - Checkboxes", {
      setup: function() {
         this.field = SPUtility.GetSPField('Checkboxes');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldMultiChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Checkboxes.length,
              5,
              "There are not 5 checkboxes.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = ["Alpha", "Charlie"];
      this.field.SetValue("Alpha", true);
      this.field.SetValue("Charlie", true);

      deepEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set the checkbox.");
   });
   
   test("Try setting the field to garbage (throws an exception)", function() {
      expect(1);
      
      throws(function(){
         this.field.SetValue("foo bar");
      });
   });

   module("SPFieldChoice - Checkboxes with Fill-in", {
      setup: function() {
         this.field = SPUtility.GetSPField('Checkboxes with Fill-in');
      }
   });

   test('GetSPField()', function() {
      expect(5);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      notStrictEqual(this.field.FillInElement, null, "Fill in element should have an element.");
      strictEqual(this.field.FillInAllowed, true, "Fill in should be allowed.");
      strictEqual(this.field.Type, "SPFieldMultiChoice", "Wrong type: " + this.field.Type);
      strictEqual(
              this.field.Checkboxes.length,
              5,
              "There are not 5 checkboxes.");
   });

   test("SetValue() and GetValue()", function() {
      expect(2);

      var expected = ["Alpha", "Charlie"];
      this.field.SetValue("Alpha", true);
      this.field.SetValue("Charlie", true);

      deepEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set the checkbox.");

      // pass a value to fill-in
      this.field.SetValue("foo bar");
      expected.push("foo bar");
      deepEqual(this.field.GetValue(),
              expected,
              "Fill-in value should be set now.");
   });



   module("SPFieldDateTime (date only)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Date Only');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldDateTime", "Wrong type: " + this.field.Type);
   });

   test("SetValue() takes individual date parameters", function() {
      expect(1);

      var expected = "08/15/2013";
      this.field.SetValue(2013, 8, 15);

      var actual = this.field.GetValue();
      equal(actual.toString(),
              expected,
              "SetValue() didn't set the date textbox.");
   });


   module("SPFieldDateTime (date and time)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Date and Time');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldDateTime", "Wrong type: " + this.field.Type);
   });

   test("SetValue() takes year, month, day, hour (str), and minute (str) parameters", function() {
      expect(1);

      var expected = "08/15/2013 8:30AM";
      this.field.SetValue(2013, 8, 15, '8 AM', '30');

      var actual = this.field.GetValue();
      equal(actual.toString(),
              expected,
              "SetValue() didn't set the date textbox.");
   });
   
   test("SetValue() takes year, month, day, hour (integer), and minute (str) parameters", function() {
      expect(1);

      var expected = "08/15/2013 8:30AM";
      this.field.SetValue(2013, 8, 15, 8, '30');

      var actual = this.field.GetValue();
      equal(actual.toString(),
              expected,
              "SetValue() didn't set the date textbox.");
   });
   
   test("SetValue() takes null or empty string to clear the field", function() {
      expect(1);

      var expected = "";
      this.field.SetValue(null);

      var actual = this.field.GetValue();
      equal(actual,
            expected,
            "Validate SetValue() can clear out the date.");
   });
   
   
   module("SPBooleanField (yes/no)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Yes/No');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldBoolean", "Wrong type: " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(1);

      var expected = true;
      this.field.SetValue(true);

      var actual = this.field.GetValue();
      equal(actual,
              expected,
              "SetValue() didn't set the checkbox.");
   });
   
   module("SPURLField (hyperlink)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Hyperlink');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldURL", "Wrong type: " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(3);

      var expected = ['http://sputility.codeplex.com', 'SPUtility.js'];
      this.field.SetValue(expected[0], expected[1]);
      
      // make sure both textboxes were set correctly
      equal(this.field.TextboxURL.val(), expected[0], 'Test the url textbox is set correctly.');
      equal(this.field.TextboxDescription.val(), expected[1], 'Test the description textbox is set correctly.');
      
      // Gets the value of the hyperlink field as an array
      var actual = this.field.GetValue();
      deepEqual(actual, expected,
              "GetValue() should return an array of two strings containing URL and Description.");
   });
   
   module("SPLookupField (single-select, small lookup)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Small Lookup');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldLookup", "Wrong type: " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(2);

      var expected = 'Charlie';
      this.field.SetValue(expected);
      
      // make sure the select was set correctly
      equal($('#Small_x0020_Lookup_fc0ce102-b10d-48f1-bdce-760fd008eead_\\$LookupField').val(), '3');
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   test("SetValue() accepts the ID (integer) as a parameter", function() {
      expect(1);

      var expected = 'Kilo';
      this.field.SetValue(11);
      
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
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldLookup", "Wrong type: " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(2);

      var expected = 'Charlie';
      this.field.SetValue(expected);
      
      // make sure the select was set correctly
      equal($('#Big_x0020_Lookup_724c2082-3c15-4fb6-b515-c1fd25afedd4_\\$LookupField').val(), '3');
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   test("SetValue() accepts the ID (integer) as a parameter", function() {
      expect(1);

      var expected = 'Kilo';
      this.field.SetValue(11);
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   module("SPLookupMultiField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Multi-value Lookup');
      }
   });

   test('GetSPField()', function() {
      expect(6);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldLookupMulti", "Expected type is SPFieldLookupMulti");
      ok(this.field.ListChoices, "Expected to have a property named ListChoices");
      ok(this.field.ListSelections, "Expected to have a property named ListSelections");
      ok(this.field.ButtonAdd, "Expected to have a property named ButtonAdd");
      ok(this.field.ButtonRemove, "Expected to have a property named ButtonRemove");
   });

   test("GetValue() and SetValue()", function() {
      expect(1);  

      var expected = ['Charlie', 'Echo', 'Golf', 'Zebra'];
      this.field.SetValue('Charlie');
      this.field.SetValue('Echo');
      this.field.SetValue('Golf');
      this.field.SetValue('Zebra');
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   test("SetValue() accepts the ID (integer) as a parameter", function() {
      expect(1);

      var expected = 'Kilo';
      this.field.SetValue(11);
      
      var actual = this.field.GetValue();
      ok($.inArray(actual, expected));
   });

   test("SetValue() allows a second boolean parameter which allows removing a value (when false)", function() {
      expect(2);

      var expected = 'Foxtrot';
      this.field.SetValue(expected);

      // test to make sure the value was added
      var actual = this.field.GetValue();
      ok($.inArray(actual, expected));

      // test to make sure the value was removed
      this.field.SetValue(6, false);
      actual = this.field.GetValue();
      ok(!$.inArray(actual, expected));
   });
   
   module("SPFieldNote (multi-line, plain text)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Multi-line Plain Text');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNote");
   });

   test("GetValue() and SetValue()", function() {
      expect(2);  

      var expected = 'Hello world!';
      this.field.SetValue(expected);
      
      // make sure the select was set correctly
      equal($('#Plain_x0020_text_eaed9c50-1cb4-4d40-9ff8-14a927419093_\\$TextField').val(), expected);
      
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
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldUser", "Wrong type: " + this.field.Type);
   });

   test("Correct properties are set", function() {
      expect(2);
      ok(this.field.ClientPeoplePicker, 'Expected to have a property named ClientPeoplePicker');
      ok(this.field.EditorInput, 'Expected to have a property named EditorInput');
   });
   
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
