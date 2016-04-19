/* Main SPUtility.js tests */
(function($) {
   /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
    module(name, {[setup][ ,teardown]})
    test(name, callback)
    expect(numberOfAssertions)
    stop(increment)
    start(decrement)
    Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    throws(block, [expected], [message])
    */

   module("SPUtility.js");

   test("SPUtility global variable", function() {
      expect(1);
      strictEqual(typeof SPUtility, 'object', "The SPUtility object should be available.");
   });

   test("SPUtility.GetSPField", function() {
      expect(1);
      strictEqual(typeof SPUtility.GetSPField, 'function', "SPUtility should have a GetSPField function.");
   });

   test("SPUtility.Setup", function() {
      expect(1);
      strictEqual(typeof SPUtility.Setup, 'function', "SPUtility should have a Setup function.");
   });

   test("GetSPField throws an error when the field was not found", function() {
      throws(function() {
            SPUtility.GetSPField('foo bar');
         },
         "Unable to get a SPField named foo bar",
         "Correct error was thrown"
      );
   });

   module("SPTextField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Title');
      }
   });

   test("Get the field", function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldText", "The field's type should be SPFieldText.");
   });

   test("Get and set the value", function() {
      expect(1);

      var expected = 'foo bar';
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");
   });

   test("MakeReadOnly()", function() {
      expect(1);

      var expected = 'foo bar';
      this.field.SetValue(expected);
      this.field.MakeReadOnly();

      ok('make read only ok');
   });

   module("SPNumberField", {
      setup: function() {
         this.field = SPUtility.GetSPField('Number');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldNumber", "The field's type should be " + this.field.Type);
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
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldCurrency", "The field's type should be " + this.field.Type);
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
         this.field = SPUtility.GetSPField('Dropdown Choice');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldChoice", "The field's type should be " + this.field.Type);
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
         this.field = SPUtility.GetSPField('Dropdown Choice with Fill-in');
      }
   });

   test('GetSPField()', function() {
      expect(4);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      notStrictEqual(this.field.FillInElement, null, "Fill in element should have an element.");
      strictEqual(this.field.FillInAllowed, true, "Fill in should be allowed.");
      strictEqual(this.field.Type, "SPFieldChoice", "The field's type should be " + this.field.Type);
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldChoice", "The field's type should be " + this.field.Type);
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldChoice", "The field's type should be " + this.field.Type);
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
              "SetValue should set the fill-in textbox.");
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldMultiChoice", "The field's type should be " + this.field.Type);
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      notStrictEqual(this.field.FillInElement, null, "Fill in element should have an element.");
      strictEqual(this.field.FillInAllowed, true, "Fill in should be allowed.");
      strictEqual(this.field.Type, "SPFieldMultiChoice", "The field's type should be SPFieldMultiChoice");
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldDateTime", "The field's type should be " + this.field.Type);
   });

   test("SetValue() takes one string parameter", function() {
      expect(1);

      var expected = "8/15/2013";
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
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldDateTime", "The field's type should be " + this.field.Type);
   });

   test("SetValue() takes year, month, day, hour (str), and minute (str) parameters", function() {
      expect(1);

      var expected = "8/15/2013 8:30 AM";
      this.field.SetValue(2013, 8, 15, '8 AM', '30');

      var actual = this.field.GetValue();
      equal(actual.toString(),
              expected,
              "SetValue() didn't set the date textbox.");
   });

   test("SetValue() takes year, month, day, hour (integer), and minute (str) parameters", function() {
      expect(1);

      var expected = "8/15/2013 8:30 AM";
      this.field.SetValue(2013, 8, 15, 8, '30');

      var actual = this.field.GetValue();
      equal(actual.toString(),
              expected,
              "SetValue() didn't set the date textbox.");
   });

   test("SetValue() takes null or empty string to clear the field", function() {
      expect(1);

      var expected = ""; // should be empty string instead of just the time
      this.field.SetValue(null);

      var actual = this.field.GetValue().toString();
      equal(actual,
            expected,
            "SetValue() didn't set the date textbox.");
   });


   module("SPBooleanField (yes/no)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Yes/No');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldBoolean", "The field's type should be " + this.field.Type);
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

   module("SPFieldNote (multi-line, plain text)", {
      setup: function() {
         this.field = SPUtility.GetSPField('Multi-line Plain Text');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldNote");
   });

   test("GetValue() and SetValue()", function() {
      expect(2);

      var expected = 'Hello world!';
      this.field.SetValue(expected);

      // make sure the select was set correctly
      equal($(this.field.Textbox).val(), expected);

      var actual = this.field.GetValue();
      strictEqual(actual, expected);
   });
}(jQuery));
