(function($) {

   // a generic test to use for each of the different fields
   var test_get_object_with_property = function() {
      expect(3);
      // get the field (should not throw an error)
      var spfield = SPUtility.GetSPField(this.spfieldName);
      // make sure we got an object
      ok(spfield, "GetSPField should return an object.");
      // the object has the property we expect
      ok(spfield[this.propertyName], "Object should have a property named " + this.propertyName);
      /// the property is assigned the correct element
      strictEqual(spfield[this.propertyName].id, this.controlId, "Property should be assigned correct element.");
   };

   module("SPTextField", {
      setup: function() {
         this.controlId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl00_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
         this.propertyName = 'Textbox';
         this.spfieldName = 'Title';
      }
   });

   test("Text fields should have a Textbox property", test_get_object_with_property);

   module("ContentTypeChoice", {
      setup: function() {
         this.controlId = 'sputility-contenttype';
         this.propertyName = 'Dropdown';
         this.spfieldName = 'Content Type';
      }
   });

   test("Content type fields should have a Dropdown property", test_get_object_with_property);

   module("SPNumberField", {
      setup: function() {
         this.controlId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl08_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
         this.propertyName = 'Textbox';
         this.spfieldName = 'Number';
      }
   });

   test("Number fields should have a Textbox property", test_get_object_with_property);

   module("SPCurrencyField", {
      setup: function() {
         this.controlId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl09_ctl00_ctl00_ctl04_ctl00_ctl00_TextField';
         this.propertyName = 'Textbox';
         this.spfieldName = 'Currency';
      }
   });

   test("Currency fields should have a Textbox property", test_get_object_with_property);

   module("SPFieldChoice - Dropdown", {
      setup: function() {
         this.controlId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl04_ctl00_ctl00_ctl04_ctl00_DropDownChoice';
         this.propertyName = 'Dropdown';
         this.spfieldName = 'Dropdown Choice';
      }
   });

   test("Dropdown Choice fields should have a Dropdown property", test_get_object_with_property);

   module("SPFieldChoice Dropdown (with fill in)", {
      setup: function() {
         this.controlId = 'ctl00_m_g_b2a76005_5d3d_4591_9f83_b32d5af4e808_ctl00_ctl05_ctl05_ctl00_ctl00_ctl04_ctl00_DropDownChoice';
         this.propertyName = 'Dropdown';
         this.spfieldName = 'Dropdown Choice with Fill-in';
      }
   });

   test("Dropdown Choice fields should have a Dropdown property", test_get_object_with_property);

}(jQuery));
