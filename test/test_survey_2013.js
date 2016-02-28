(function($) {
   module("SPFieldGridChoice", {
      setup: function() {
         this.field = SPUtility.GetSPField('Rating Scale');
      }
   });

   test("Get the field", function() {
      expect(2);
      notStrictEqual(this.field, null, "GetSPField returned null (should have returned an object).");
      strictEqual(this.field.Type, "SPFieldGridChoice", "Wrong type: " + this.field.Type);
   });

   test("The static function to get SPFields is available.", function() {
      ok(SPUtility.GetSPField);
      ok($);
   });
}(jQuery));
