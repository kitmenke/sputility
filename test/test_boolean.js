/* Tests specific to Yes/No (boolean) fields */
(function() {
   module("SPBooleanField (customizable strings)", {
      setup: function() {
         SPUtility.Setup({
            'stringYes': 'Yep',
            'stringNo': 'Nope'
         });
      }
   });

   test('MakeReadOnly', function() {
      expect(2);
      var field = SPUtility.GetSPField('Yes/No');
      var expected = "Nope";
      strictEqual(typeof field, "object", "GetSPField should have returned an object.");
      field.SetValue(false).MakeReadOnly();
      strictEqual(field.ReadOnlyLabel.text(), expected, "Setting the value to false should result in Nope.");
   });

   test('MakeReadOnly for one field only', function() {
      expect(2);
      var field = SPUtility.GetSPField('Yes/No2');
      var expected = "Declined";
      strictEqual(typeof field, "object", "GetSPField should have returned an object.");
      field.SetValue(false).MakeReadOnly("Approved", "Declined");
      strictEqual(field.ReadOnlyLabel.text(), expected, "Setting the value to false should result in Declined.");
   });
}(jQuery));
