(function($) {
   /*
    * For testing integration with SharePoint 2013
    */

   module("Main");

   test("The static function to get SPFields is available.", function() {
      expect(5);
      ok($, "Should have jQuery available in order to use SPUtility.js");
      ok(SPUtility.GetSPField, "SPUtility should have a public GetSPField method.");
      ok(SPUtility.GetSPFieldByInternalName, "SPUtility should have a public GetSPFieldByInternalName method.");
      ok(SPUtility.HideSPField, "SPUtility should have a public HideSPField method.");
      ok(SPUtility.ShowSPField, "SPUtility should have a public ShowSPField method.");
   });

   test("GetSPField throws an error when the field was not found.", function() {
      throws(
        function() {
           SPUtility.GetSPField('foo bar');
        },
        "Should throw an exception when the field is not found.");
   });

   test("GetSPFieldByInternalName throws an error when the field was not found.", function() {
      throws(
        function() {
           SPUtility.GetSPFieldByInternalName('foo_x0020_bar');
        },
        "Should throw an exception when the field is not found.");
   });
   
   test("GetSPFields()", function() {
      expect(0);
      SPUtility.GetSPFields();
   });
   
   test("HideSPField()", function() {
      expect(0);
      SPUtility.HideSPField('Title');
   });
   
   test("ShowSPField()", function() {
      expect(0);
      SPUtility.ShowSPField('Title');
   });

   module("SPTextField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Title');
      }
   });

   test("Get the field", function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldText", "Wrong type: " + this.field.Type);
      ok(this.field.Textbox, "Should have a Textbox property.");
   });

   test("Get the field using the internal name", function() {
      expect(1);
      var field = SPUtility.GetSPFieldByInternalName('Title');
      ok(field, 'Should allow getting fields using internal name.');
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
      expect(3);

      var expected = 'foo bar';
      this.field.SetValue(expected);
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
          expected,
          "Validate SetValue() updates the read-only label.");
      strictEqual($(this.field.Controls).css('display'), "none");
      this.field.MakeEditable();
      strictEqual($(this.field.Controls).css('display'), "inline");
   });

   module("SPNumberField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Number');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNumber", "Wrong type: " + this.field.Type);
      ok(this.field.Textbox, "Expected to have a Textbox property.");
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
         this.field = SPUtility.GetSPField('Currency');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldCurrency", "Wrong type: " + this.field.Type);
      ok(this.field.Textbox, "Expected to have a Textbox property.");
   });

   test("SetValue() and GetValue()", function() {
      expect(1);

      var expected = 42;
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });
   
   test("MakeReadOnly()", function() {
      expect(1);

      var expected = "$42.00";
      this.field.SetValue(42);
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
              expected,
              "MakeReadOnly should set a read only label.");
   });

   function testMakeReadOnlySingleSelectChoiceFields() {
      expect(2);
      
      var expected = "Delta";
      this.field.SetValue(expected);
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();
      
      strictEqual(actual,
         expected,
         "MakeReadOnly should create a read only label.");
      
      expected = "Echo";
      this.field.SetValue(expected);
      actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
              expected,
              "MakeReadOnly should update a read only label.");

   }

   module("SPFieldChoice - Dropdown", {
      setup: function() {
         this.field = SPUtility.GetSPField('Dropdown Choice');
      }
   });

   test('GetSPField()', function() {
      expect(3);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      ok(this.field.Dropdown, "Expected to have a Dropdown property.");
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
   
   test("MakeReadOnly()", testMakeReadOnlySingleSelectChoiceFields);
   
   module("SPFieldChoice Dropdown (with fill in)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Dropdown Choice with Fill-in');
      }
   });

   test('GetSPField()', function() {
      expect(5);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      notStrictEqual(this.field.FillInElement, null, "Fill in element should have an element.");
      strictEqual(this.field.FillInAllowed, true, "Fill in should be allowed.");
      strictEqual(this.field.Type, "SPFieldChoice", "Wrong type: " + this.field.Type);
      ok(this.field.Dropdown, "Expected to have a Dropdown property.");
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
   
   test("MakeReadOnly()", testMakeReadOnlySingleSelectChoiceFields);
   
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
      notStrictEqual(this.field, null, "GetSPField should return an object.");
      strictEqual(this.field.Type, "SPFieldMultiChoice", "Should be of type SPFieldMultiChoice");
      strictEqual(
              this.field.Checkboxes.length,
              5,
              "Should have 5 checkboxes.");
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
   
   test("MakeReadOnly()", function() {
      expect(1);

      var expected = "Alpha; Charlie";
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
              expected,
              "MakeReadOnly should set a read only label.");
   });
   
   test("MakeReadOnly() update", function() {
      expect(1);

      var expected = "Alpha; Charlie; Delta";
      this.field.SetValue("Delta");
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
              expected,
              "MakeReadOnly should update a read only label.");
   });
   
   test("Try setting the field to garbage (throws an exception)", function() {
      expect(1);
      
      throws(function(){
         this.field.SetValue("foo bar");
      });
   });

   test("SetValue should allow a second boolean parameter to uncheck a box", function() {
      expect(2);

      var expected = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
      var field = this.field;
      $(expected).each(function(i, str) {
        field.SetValue(str);
      });

      deepEqual(this.field.GetValue(),
              expected,
              "SetValue should have checked all of the checkboxes");

      this.field.SetValue("Bravo", false);
      expected = ["Alpha", "Charlie", "Delta", "Echo"];
      deepEqual(this.field.GetValue(),
              expected,
              "SetValue should have unchecked one of the checkboxes");
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
              "SetValue() failed to scet the checkbox.");

      // pass a value to fill-in
      this.field.SetValue("foo bar");
      expected.push("foo bar");
      deepEqual(this.field.GetValue(),
              expected,
              "Fill-in value should be set now.");
   });
   
   test("MakeReadOnly()", function() {
      expect(1);

      var expected = "Alpha; Charlie; foo bar";
      this.field.SetValue("Alpha");
      this.field.SetValue("Charlie");
      this.field.SetValue("foo bar");
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
              expected,
              "MakeReadOnly should set a read only label.");
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

   test("Get the field using the internal name", function() {
      expect(1);
      var field = SPUtility.GetSPFieldByInternalName('Date_x0020_Only');
      ok(field, 'Should allow getting fields using internal name.');
   });

   test("SetValue() takes individual date parameters", function() {
      expect(1);

      this.field.SetValue(2013, 8, 15);

      var actual = this.field.GetValue().toString();

      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2013",
              "Validate SetValue set the date");
      } else {
        equal(actual,
              "15/08/2013",
              "Validate SetValue set the date");
      }
   });

   test("SetValue() takes null or empty string to clear the field", function() {
      expect(1);

      var expected = ""; // clearing time effectively sets back to 12 AM
      this.field.SetValue(null);

      var actual = this.field.GetValue().toString();
      equal(actual,
            expected,
            "Validate SetValue() can clear out the date.");
   });

   test("SetDate() can set the date", function() {
      expect(1);

      this.field.SetDate(2014, 12, 25);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "12/25/2014",
              "Validate SetDate set the date");
      } else {
        equal(actual,
              "25/12/2014",
              "Validate SetDate set the date");
      }
   });

   test("SetTime() should throw an exception for date only fields", function() {
      var field = this.field;
      throws(
        function() {
           field.SetTime(9, 30);
        },
        "Should throw an exception when trying to set the time on a date only field.");
   });

    test("Twenty-four hour date format with a period separator", function() {
      expect(3);

      SPUtility.SetDateSeparator('.');
      SPUtility.SetTimeFormat('24HR');

      this.field.SetValue(2015, 3, 10);

      var actual = this.field.GetValue();
      strictEqual(actual.TimeFormat, '24HR');
      strictEqual(actual.DateSeparator, '.');
      strictEqual(actual.toString(),
            "10.03.2015",
            "Should set to March 10, 2015");

      // set it back
      SPUtility.SetDateSeparator('/');
      SPUtility.SetTimeFormat('12HR');
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

   test("Get the field using the internal name", function() {
      expect(1);
      var field = SPUtility.GetSPFieldByInternalName('Date_x0020_and_x0020_Time');
      ok(field, 'Should allow getting fields using internal name.');
   });

   test("SetValue() takes year, month, day, hour (str), and minute (str) parameters", function() {
      expect(1);

      this.field.SetValue(2013, 8, 15, '8 AM', '30');

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2013 8:30 AM",
              "Validate SetValue takes hour and minute parameter as strings");
      } else {
        equal(actual,
              "15/08/2013 08:30",
              "Validate SetValue takes hour and minute parameter as strings");
      }
   });
   
   test("SetValue() takes year, month, day, hour (integer), and minute (str) parameters", function() {
      expect(1);

      this.field.SetValue(2013, 8, 15, 8, '30');

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2013 8:30 AM",
              "Validate SetValue takes minute parameter as a string");
      } else {
        equal(actual,
              "15/08/2013 08:30",
              "Validate SetValue takes minute parameter as a string");
      }
   });

   test("SetValue() takes year, month, day, hour (integer), and minute (integer) parameters", function() {
      expect(1);

      this.field.SetValue(2013, 8, 15, 8, 30);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2013 8:30 AM",
              "Validate SetValue takes all integer parameters.");
      } else {
        equal(actual,
              "15/08/2013 08:30",
              "Validate SetValue takes all integer parameters.");
      }
   });
   
   test("SetValue() takes null or empty string to clear the field", function() {
      expect(1);

      // clearing time effectively sets back to 12 AM
      this.field.SetValue(null);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "12:00 AM",
              "Validate SetValue() can clear out the date.");
      } else {
        equal(actual,
              "00:00",
              "Validate SetValue() can clear out the date.");
      }
   });

   test("SetDate() takes year, month, and day parameters to set only the date", function() {
      expect(1);

      // clear the field
      this.field.SetValue(null);
      this.field.SetDate(2014, 5, 7);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "5/7/2014 12:00 AM",
              "SetDate() should set only the date portion of the field (not the time).");
      } else {
        equal(actual,
              "07/05/2014 00:00",
              "SetDate() should set only the date portion of the field (not the time).");
      }
   });

   test("SetDate() takes null to clear out only the date", function() {
      expect(2);

      this.field.SetValue(2014, 4, 2, 9, 45);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "4/2/2014 9:45 AM",
              "Should set date and time.");
      } else {
        equal(actual,
              "02/04/2014 09:45",
              "Should set date and time.");
      }

      this.field.SetDate(null);
      actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "9:45 AM",
              "SetDate() should change only the date portion of the field (not the time).");
      } else {
        equal(actual,
              "09:45",
              "SetDate() should change only the date portion of the field (not the time).");
      }
   });

   test("SetTime() takes hour and minute parameters to set only the time", function() {
      expect(1);

      this.field.SetDate(null);
      this.field.SetTime(8, 30);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8:30 AM",
              "SetDate() should clear only the date portion.");
      } else {
        equal(actual,
              "08:30",
              "SetDate() should clear only the date portion.");
      }
   });

   test("SetTime() takes null to reset the time to 12 AM", function() {
      expect(2);

      this.field.SetValue(2014, 8, 15, 15, 25);

      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2014 3:25 PM",
              "Should set date and time.");
      } else {
        equal(actual,
              "15/08/2014 15:25",
              "Should set date and time.");
      }

      this.field.SetTime(null);
      actual = this.field.GetValue().toString();

      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "8/15/2014 12:00 AM",
              "SetTime() should clear out only the time portion.");
      } else {
        equal(actual,
              "15/08/2014 00:00",
              "SetTime() should clear out only the time portion.");
      }
   });
   
   test("SetValue() updates the label if the field is read only (issue #5)", function() {
      expect(1);

      this.field.MakeReadOnly();
      this.field.SetValue(2013,1,2,'1 PM','35');
      
      var actual = this.field.ReadOnlyLabel.text();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "1/2/2013 1:35 PM",
              "Validate SetValue() updates the read-only label.");
      } else {
        equal(actual,
              "02/01/2013 13:35",
              "Validate SetValue() updates the read-only label.");
      }
   });

   test("GetValue() displays the correct time when it is set to 12 PM", function() {
      expect(1);

      this.field.SetValue(2014,3,14,12,0);
      
      var actual = this.field.GetValue().toString();
      if (SPUtility.GetTimeFormat() === '12HR') {
        equal(actual,
              "3/14/2014 12:00 PM",
              "Validate time is set to 12 PM.");
      } else {
        equal(actual,
              "14/03/2014 12:00",
              "Validate time is set to 12 PM.");
      }
   });

   test("GetValue() returns SPDateTimeValue with a TimeFormat property", function() {
      expect(1);

      var value = this.field.GetValue();

      if (SPUtility.GetTimeFormat() === '12HR') {
        strictEqual(value.TimeFormat,
            '12HR',
            "Validate TimeFormat is 12HR.");
      } else {
        strictEqual(value.TimeFormat,
            '24HR',
            "Validate TimeFormat is 24HR.");
      }
   });

   test("Twenty-four hour date format with a period separator", function() {
      expect(3);

      SPUtility.SetDateSeparator('.');
      SPUtility.SetTimeFormat('24HR');

      this.field.SetValue(2015, 3, 10, 20, 30);

      var actual = this.field.GetValue();
      strictEqual(actual.TimeFormat, '24HR');
      strictEqual(actual.DateSeparator, '.');
      strictEqual(actual.toString(),
            "10.03.2015 20:30",
            "Should set to March 10, 2015");

      // set it back
      SPUtility.SetDateSeparator('/');
      SPUtility.SetTimeFormat('12HR');
   });

   test("MakeEditable()", function() {
      expect(1);

      this.field.MakeEditable();
      strictEqual($(this.field.Controls).css('display'), "inline");
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

   test("MakeReadOnly should show yes when setting field to checked", function() {
      expect(1);

      var expected = "Yes";
      this.field.SetValue("yes");
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.html();
      equal(actual,
              expected,
              "MakeReadOnly should set the label to be yes.");
   });

   test("MakeReadOnly should show no when setting field to unchecked", function() {
      expect(1);

      var expected = "No";
      this.field.SetValue("no");
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.html();
      equal(actual,
              expected,
              "MakeReadOnly should set the label to be yes.");
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
   
   test("MakeReadOnly() Default hyperlink", function() {
      expect(1);
      this.field.SetValue("http://sputility.codeplex.com/", "SPUtility.js");
      var expected = '<a href="http://sputility.codeplex.com/">SPUtility.js</a>';
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.html();

      // case seems to uppercase in SP 2007 so do a case insensitive compare
      strictEqual(actual.toUpperCase(),
              expected.toUpperCase(),
              "MakeReadOnly should set a read only label as a hyperlink.");
   });
   
   test("MakeReadOnly() Text only", function() {
      expect(1);
      this.field.SetValue("http://sputility.codeplex.com", "SPUtility.js");
      var expected = "http://sputility.codeplex.com, SPUtility.js";
      this.field.MakeReadOnly({ TextOnly: true });
      var actual = this.field.ReadOnlyLabel.html();

      strictEqual(actual,
              expected,
              "MakeReadOnly should set a read only label as text.");
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

   test("Get the field using the internal name", function() {
      expect(1);
      var field = SPUtility.GetSPFieldByInternalName('Small_x0020_Lookup');
      ok(field, 'Should allow getting fields using internal name.');
   });

   test("GetValue() and SetValue()", function() {
      expect(1);

      var expected = 'Charlie';
      this.field.SetValue(expected);

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
         this.field = SPUtility.GetSPField('Large Lookup');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldLookup", "Wrong type: " + this.field.Type);
   });

   test("GetValue() and SetValue()", function() {
      expect(1);

      var expected = 'Charlie';
      this.field.SetValue(expected);
      
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
   
   test("Can make the field read-only (issue #6)", function() {
      expect(1);  

      var expected = 'Charlie; Echo';
      this.field.SetValue('Charlie');
      this.field.SetValue('Echo');
      this.field.MakeReadOnly();
      var actual = this.field.ReadOnlyLabel.text();

      strictEqual(actual,
          expected,
          "Validate SetValue() updates the read-only label.");
   });

   test("GetValue() and SetValue()", function() {
      expect(1);  

      var expected = ['Charlie', 'Echo', 'Golf', 'Zebra'];
      this.field.SetValue('Charlie');
      this.field.SetValue('Echo');
      this.field.SetValue('Golf');
      this.field.SetValue('Zebra');
      
      var actual = this.field.GetValue();
      deepEqual(actual, expected);
   });

   test("SetValue() accepts the ID (integer) as a parameter", function() {
      expect(1);

      var expected = 'Kilo';
      this.field.SetValue(11);
      
      var actual = this.field.GetValue();
      var isInArray = $.inArray(expected, actual);
      ok(isInArray >= 0);
   });

   test("SetValue() allows a second boolean parameter which allows removing a value (when false)", function() {
      expect(2);

      var expected = 'Foxtrot';
      this.field.SetValue(expected);

      // test to make sure the value was added
      var actual = this.field.GetValue();
      var isInArray = $.inArray(expected, actual);
      ok(isInArray >= 0);

      // test to make sure the value was removed
      this.field.SetValue(6, false);
      actual = this.field.GetValue();
      isInArray = $.inArray(expected, actual);
      ok(isInArray === -1);
   });
   
   module("SPFieldNote (multi-line, plain text)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Multi-line Plain Text');
      }
   });

   test('GetSPField()', function() {
      expect(4);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNote");
      strictEqual(this.field.TextType, "Plain");
      ok(this.field.Textbox, "Expected to have a Textbox property.");
   });

   test("GetValue() and SetValue()", function() {
      expect(1);  

      var expected = 'Hello world!';
      this.field.SetValue(expected);
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });

   module("SPFieldNote (multi-line, rich text) [Internet Explorer only]", {
      setup: function() {
         this.field = SPUtility.GetSPField('Rich Text');
      }
   });

   test('GetSPField()', function() {
      expect(4);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNote");
      // TODO: maybe need some browser sniffing?
      ok(this.field.TextType === "Rich" || this.field.TextType === "Plain", "Internet Explorer will have the Rich type, other browsers get Plain");
      ok(this.field.Textbox, "Expected to have a Textbox property.");
   });

   test("GetValue() and SetValue()", function() {
      expect(1);  

      var expected = '<strong>Hello world!</strong>';
      this.field.SetValue(expected);
      
      var actual = this.field.GetValue();
      // case seems to uppercase in SP 2007 so do a case insensitive compare
      strictEqual(actual.toUpperCase(), expected.toUpperCase());
   });

   module("SPFieldNote (multi-line, ENHANCED rich text) [2010 and 2013 only]", {
      setup: function() {
         this.field = SPUtility.GetSPField('Enhanced Rich Text');
      }
   });

   test('GetSPField()', function() {
      expect(4);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldNote");
      strictEqual(this.field.TextType, "Enhanced");
      ok(this.field.Textbox, "Expected to have a Textbox property.");
   });

   test("GetValue() and SetValue()", function() {
      expect(1);  

      // fancy header, lists, and a table
      var expected = '<h1>​Hello world!</h1>';
      expected += '<ul>';
      expected += '   <li>one</li>';
      expected += '   <li>two</li>';
      expected += '   <li>three</li>';
      expected += '</ul>';
      expected += '<table width="100%" class="ms-rteTable-default" cellspacing="0">';
      expected += '   <tbody>';
      expected += '      <tr>';
      expected += '         <td class="ms-rteTable-default" style="width: 50%;">​cell one</td>';
      expected += '         <td class="ms-rteTable-default" style="width: 50%;">​cell two</td>';
      expected += '      </tr>';
      expected += '   </tbody>';
      expected += '</table>';
      this.field.SetValue(expected);
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });
   
   module("SPUserField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Person or Group');
      }
   });

   test('GetSPField()', function() {
      expect(4);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldUser", "Field Type should be SPFieldUser");
      ok(this.field.ClientPeoplePicker, 'Expected to have a property named ClientPeoplePicker');
      ok(this.field.EditorInput, 'Expected to have a property named EditorInput');
   });

   test("GetValue() and SetValue()", function() {
      expect(2);  

      var expected = 'Chris Menke';
      this.field.SetValue(expected);
      
      var actual = this.field.GetValue();
      strictEqual(actual, expected);
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
