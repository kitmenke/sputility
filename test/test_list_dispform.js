/* Tests specific to SharePoint lists */
(function() {
   module("List DispForm");

   test("Get the Title field's value", function() {
      expect(2);
      var field = SPUtility.GetSPField('Title');
      ok(field, "GetSPField should return object.");
      strictEqual(field.GetValue(), "Alpha", "GetValue should work on DispForm.");
   });

   test("Get the Multi-line Plain Text field's value", function() {
      expect(2);
      var field = SPUtility.GetSPField('Multi-line Plain Text');
      ok(field, "GetSPField should return object.");
      strictEqual(field.GetValue(), "Alpha hello world", "GetValue should work on DispForm.");
   });

   test("Get the Dropdown Choice field's value", function() {
      expect(2);
      var field = SPUtility.GetSPField('Dropdown Choice');
      ok(field, "GetSPField should return object.");
      strictEqual(field.GetValue(), "Alpha", "GetValue should work on DispForm.");
   });

   test("Get the Dropdown Choice with Fill-in field's value", function() {
      expect(2);
      var field = SPUtility.GetSPField('Dropdown Choice with Fill-in');
      ok(field, "GetSPField should return object.");
      strictEqual(field.GetValue(), "Alpha", "GetValue should work on DispForm.");
   });
}(jQuery));
