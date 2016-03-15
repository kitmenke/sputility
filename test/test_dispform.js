(function() {
   module("DispForm");

   test("The static function IsDispForm is available and working.", function() {
      expect(1);
      ok(SPUtility.IsDispForm(), "The IsDispForm method should return true.");
   });
}(jQuery));
