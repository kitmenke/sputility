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
      expect(5);
      var field = SPUtility.GetSPField('Yes/No');
      strictEqual(typeof field, "object", "GetSPField should have returned an object.");
      field.SetValue(false).MakeReadOnly();
      strictEqual(field.ReadOnlyLabel.text(), "Nope", "Setting the value to false should result in Nope.");
      field.SetValue(true);
      strictEqual(field.ReadOnlyLabel.text(), "Yep", "Setting the value to false should result in Yep.");
      field.SetValue('Nope');
      strictEqual(field.ReadOnlyLabel.text(), "Nope", "Setting the value to Nope should result in Nope.");
      field.SetValue('Yep');
      strictEqual(field.ReadOnlyLabel.text(), "Yep", "Setting the value to Nope should result in Yep.");
   });
}(jQuery));
