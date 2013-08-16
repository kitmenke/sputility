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

   module("Main");

   test("The static function to get SPFields is available.", function() {
      ok(SPUtility.GetSPField);
      ok($);
   });

   test("spfield throws an error when the field was not found", function() {
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
         this.textboxId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl00_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
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

   test("MakeReadOnly()", function() {
      expect(1);

      var expected = 'foo bar';
      this.field.SetValue(expected);
      this.field.MakeReadOnly();

      ok('make read only ok');
   });


   module("SPNumberField", {
      setup: function() {
         this.textboxId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl08_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
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
         this.textboxId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl09_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
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
         this.dropdownId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl04_ctl00_ctl00_ctl04_ctl00_DropDownChoice';
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
      expect(2);

      var expected = "Charlie";
      this.field.SetValue(expected);

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set Textbox.");

      // try setting the dropdown to garbage (it should just be ignored)
      this.field.SetValue("foo bar");

      strictEqual(this.field.GetValue(),
              expected,
              "Passing SetValue() garbage changed the value.");
   });

   module("SPFieldChoice Dropdown (with fill in)", {
      setup: function() {
         this.dropdownId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl05_ctl00_ctl00_ctl04_ctl00_DropDownChoice';
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
      expect(2);

      var expected = ["Alpha", "Charlie"];
      this.field.SetValue("Alpha", true);
      this.field.SetValue("Charlie", true);

      deepEqual(this.field.GetValue(),
              expected,
              "SetValue() failed to set the checkbox.");

      // pass a garbage value
      this.field.SetValue("foo bar");
      deepEqual(this.field.GetValue(),
              expected,
              "Passing garbage to SetValue() changed the value.");
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

   test("SetValue() takes one string parameter", function() {
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

   test("SetValue() takes one string parameter", function() {
      expect(1);

      var expected = "08/15/2013 8:30AM";
      this.field.SetValue(2013, 8, 15, '8 AM', '30');

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
            "SetValue() didn't set the date textbox.");
   });

}(jQuery));
