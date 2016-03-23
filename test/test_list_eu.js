/* Tests specific to SharePoint lists */
(function() {
   module("SPNumberField (Europe)", {
      setup: function() {
         SPUtility.SetDecimalSeparator(',');
         SPUtility.SetThousandsSeparator('.');
         this.field = SPUtility.GetSPField('Number');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldNumber", "The field's type should be " + this.field.Type);
   });

   test("SetValue() and GetValue()", function() {
      expect(2);

      var expected = 50000;
      strictEqual(this.field.GetValue(),
              expected,
              "GetValue should return fifty thousand.");

      expected = 1000000;
      this.field.SetValue('1.000.000');

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue should set the field to one million.");
   });

   module("SPCurrencyField (Europe)", {
      setup: function() {
         SPUtility.SetDecimalSeparator(',');
         SPUtility.SetThousandsSeparator('.');
         this.field = SPUtility.GetSPField('Currency');
      }
   });

   test('GetSPField()', function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField should have returned an object.");
      strictEqual(this.field.Type, "SPFieldCurrency", "The field's type should be " + this.field.Type);
   });

   test("SetValue() and GetValue()", function() {
      expect(2);

      var expected = 1234567.89;
      strictEqual(this.field.GetValue(),
              expected,
              "GetValue should return one million two hundred thirty four thousand five hundred sixty seven and eighty nine cents.");

      expected = 1000.95;
      this.field.SetValue('1.000,95');

      strictEqual(this.field.GetValue(),
              expected,
              "SetValue should set the field to one thousand and ninety five cents.");
   });
}(jQuery));
