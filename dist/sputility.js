/*! SPUtility.js - v0.1.0 - 2013-03-18
* https://github.com/kitmenke/jquery.sputility
* Copyright (c) 2013 Kit Menke; Licensed MIT */
if (!Object.create) {
   Object.create = function (o) {
      if (arguments.length > 1) {
         throw new Error('Object.create implementation only accepts the first parameter.');
      }
      function F() {}
      F.prototype = o;
      return new F();
   };
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/number/fmt-money [rev. #2]
// Modified to pass JSLint
// c = # of floating point decimal places
// d = decimal separator
// t = thousands separator
Number.prototype.formatMoney = function (c, d, t) {
   c = (isNaN(c = Math.abs(c)) ? 2 : c);
   d = (d === undefined ? "." : d);
   t = (t === undefined ? "," : t);
   var n = this, 
      s = (n < 0 ? "-" : ""),
      i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "", 
      j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/*
 *   SPUtility namespace
 */
(function (window, $) {
   "use strict";
   
   /*
    *   SPUtility Private Variables
   **/
   var _fieldsHashtable = null,
      _debugMode = false,
      _isSurveyForm = false,
      _numErrors = 0; 
   
   /*
    *   SPUtility Private Methods
   **/
   
   function isUndefined(obj) {
      return typeof obj === 'undefined';
   }

   function log(message, exception) {
      var property;
      if (!_debugMode) {
         return;
      }
      if (exception) {
         message += '\r\n';
         for (property in exception) {
            if (exception.hasOwnProperty(property)) {
               message += property + ': ' + exception[property] + '\r\n';
            }
         }
      }
      if (isUndefined(console)) {
         _numErrors += 1;
         if (_numErrors === 3) {
            message = "More than 3 errors (additional errors will not be shown):\r\n" + message;
         }
         if (_numErrors <= 3) {
            alert(message);
         }
      } else {
         console.error(message);
      }
   }
   
   function convertStringToNumber(val) {
      if (typeof val === "string") {
         var match = val.match(/[0-9,.]+/g);
         if (null !== match) {
            val = match[0].replace(/,/g, ''); // commas to delimit thousands need to be removed
            val = parseFloat(val);
         }
      }
      return val;
   }
   
   // Gets the input controls for a field (used for Textboxes)
   function getInputControl(spField) {
      if (spField.Controls === null) {
         // if running on DispForm.aspx Controls will be null
         return null;
      }
      var controls = $(spField.Controls).find('input');
      if (null !== controls && 1 === controls.length) {
         return controls[0];
      }
      
      throw 'Unable to retrieve the input control for ' + spField.Name;
   }
   
   /*
   function getHashFromInputControls(spField, selector) {
      var oHash = null, inputTags = $(spField.Controls).find(selector), inputLabel, key;
      if (null !== inputTags && inputTags.length > 0) {
         oHash = {};
         
         inputTags.each(function (elem) {
            inputLabel = elem.next(0);
            if (!isUndefined(inputLabel)) {
               key = $(inputLabel).text();
               oHash[key] = elem;
            }
         });
      }
      return oHash;
   }*/
   
   function getSPFieldType(element) {
      var matches, comment, n;
      try {
         // find the HTML comment and get the field's type
         for (n = 0; n < element.childNodes.length; n += 1) {
            if (8 === element.childNodes[n].nodeType) {
               comment = element.childNodes[n].data;
               matches = comment.match(/SPField\w+/);
               if (null !== matches) {
                  return matches[0];
               }
               break;
            }
         }         
      } catch (ex) {
         log('getSPFieldType: Error getting field type', ex);
      }
      return null;
   }
   
   function getSPFieldFromType(spFieldParams) {
      var field = null;
      
      switch (spFieldParams.type) {
      case 'SPFieldText':
         field = new SPTextField(spFieldParams);
         break;
      case 'SPFieldNumber':
         field = new SPNumberField(spFieldParams);
         break;
      case 'SPFieldCurrency':
         field = new SPCurrencyField(spFieldParams);
         break;
         /*
      case 'SPFieldNote':
         field = new SPNoteField(spFieldParams);
         break;
      case 'SPFieldBoolean':
         field = new SPBooleanField(spFieldParams);
         break;
      case 'SPFieldFile':
         field = new SPFileField(spFieldParams);
         break;
      case 'SPFieldDateTime':
         field = new SPDateTimeField(spFieldParams);
         break;
      case 'SPFieldChoice':
      case 'SPFieldMultiChoice':
         field = new SPChoiceField(spFieldParams);
         break;
      case 'SPFieldURL':
         field = new SPURLField(spFieldParams);
         break;
      case 'SPFieldUser':
      case 'SPFieldUserMulti':
         field = new SPUserField(spFieldParams);
         break;
      case 'SPFieldLookup':
         field = new SPLookupField(spFieldParams);
         break;
      case 'SPFieldLookupMulti':
         field = new SPLookupMultiField(spFieldParams);
         break;*/
      default:
         field = new SPField(spFieldParams);
         break;
      }
      return field;
   }
   
   function createSPField(spFieldParams) {
      var field = null;
      try {
         if (null === spFieldParams.controlsCell) {
            // the only time this property will NOT be null is in survey forms
            spFieldParams.controlsCell = $(spFieldParams.labelCell).next()[0];
            // use nextSibling?
         }
         spFieldParams.type = getSPFieldType(spFieldParams.controlsCell);
         
         // if we can't get the type then we can't create the field
         if (null === spFieldParams.type) {
            return null;
         }
         
         field = getSPFieldFromType(spFieldParams);
      } catch (e) {
         log('createSPField: Error creating field for ' + spFieldParams.name, e);
      }
      return field;
   }
   
   function getFieldParams(elemTD, surveyElemTD, isSurveyForm) {
      var fieldParams = null, fieldName = 'Unknown field', elemLabel, isRequired;
      try {
         if (isSurveyForm) {
            elemLabel = elemTD;
         } else {
            // navigate TD -> ??
            elemLabel = $(elemTD).children()[0];
            if (null === elemLabel || elemLabel.nodeName === 'NOBR') {
               return null; // attachments row not currently supported
            }
         }
         
         fieldName = $(elemLabel).text().trim();
         isRequired = fieldName.lastIndexOf(' *') === (fieldName.length - 2);
         
         if (true === isRequired) {
            fieldName = fieldName.substring(0, fieldName.length - 2);
         }
         
         fieldParams = {
            'name': fieldName,
            'label': $(elemLabel),
            'labelRow': $(elemTD.parentNode),
            'labelCell': elemTD,
            'isRequired': isRequired,
            'controlsRow': isUndefined(surveyElemTD) ? null : $(surveyElemTD.parentNode),
            'controlsCell': isUndefined(surveyElemTD) ? null : surveyElemTD,
            'type': null,
            'spField': null
         };
      } catch (e) {
         log('getFieldParams: Error getting field parameters ' + fieldName, e);
      }
      return fieldParams;
   }
   
   function lazyLoadSPFields() {
      if (null === _fieldsHashtable) {
         var i, fieldParams,
            fieldElements = $('table.ms-formtable td.ms-formlabel'),
            surveyElements = $('table.ms-formtable td.ms-formbodysurvey'),
            len = fieldElements.length;

         _isSurveyForm = (surveyElements.length > 0);
         _fieldsHashtable = {};
         
         for (i = 0; i < len; i += 1) {
            fieldParams = getFieldParams(fieldElements[i], surveyElements[i], _isSurveyForm);
            if (null !== fieldParams) {
               _fieldsHashtable[fieldParams.name] = fieldParams;
            }
         }
      }
   }
   
   function toggleSPFieldRows(labelRow, controlsRow, bShowField) {
      // controlsRow is populated on survey forms (null otherwise)
      if (bShowField) {
         labelRow.show();
         if (null !== controlsRow) {
            controlsRow.show();
         }
      } else {
         labelRow.hide();
         if (null !== controlsRow) {
            controlsRow.hide();
         }
      }
   }
   
   function toggleSPField(strFieldName, bShowField) {
      lazyLoadSPFields();
         
      var fieldParams = _fieldsHashtable.get(strFieldName);
      
      if (isUndefined(fieldParams)) { 
         log('toggleSPField: Unable to find a SPField named ' + strFieldName + ' - ' + bShowField);
         return;
      }
      
      toggleSPFieldRows(fieldParams.labelRow, fieldParams.controlsRow, bShowField);
   }
   
   function updateReadOnlyLabel(spField) {
      if (spField.ReadOnlyLabel) {
         spField.ReadOnlyLabel.update(spField.GetValue());
      }
   }
   
   function makeReadOnly(spField, htmlToInsert) {
      try {
         $(spField.Controls).hide();
         if (null === spField.ReadOnlyLabel) {
            spField.ReadOnlyLabel = $('<div/>').addClass('sputility-readonly').after(spField.Controls);
         }
         spField.ReadOnlyLabel.html(htmlToInsert);
         spField.ReadOnlyLabel.show();
      } catch (ex) {
         alert('Error making ' + spField.Name + ' read only. ' + ex.toString());
      }
      return spField;
   }
   
   /*
   function arrayToSemicolonList(arr) {
      var text = '';
      
      arr.each(function (value) {
         text += value + '; ';
      });
      
      if (text.length > 2) {
         text = text.substring(0, text.length - 2);
      }
      
      return text;
   }*/
   
   /*
    *   SPUtility Classes
   **/
   
   /*
    *   SPField class
    *   Contains all of the common properties and functions used by the specialized
    *   sub-classes. Typically, this should not be intantiated directly.
    */
   function SPField(fieldParams) {
      // Public Properties
      this.Label = fieldParams.label;
      this.LabelRow = fieldParams.labelRow;
      this.Name = fieldParams.name;
      this.IsRequired = fieldParams.isRequired;
      this.Type = fieldParams.type;
      this.Controls = $(fieldParams.controlsCell).children()[0];
      this.ControlsRow = fieldParams.controlsRow;
      this.ReadOnlyLabel = null;
   }

   /*
    *   Public SPField Methods
    */
   SPField.prototype.Show = function () {
      toggleSPFieldRows(this.LabelRow, this.ControlsRow, true);
      return this;
   };
   
   SPField.prototype.Hide = function () {
      toggleSPFieldRows(this.LabelRow, this.ControlsRow, false);
      return this;
   };
   
   SPField.prototype.MakeReadOnly = function () {
      return makeReadOnly(this, this.GetValue().toString());
   };
     
   SPField.prototype.MakeEditable = function () {
      try {
         this.Controls.hide();
         if (null !== this.ReadOnlyLabel) {
            this.ReadOnlyLabel.hide();
         }
      } catch (ex) {
         alert('Error making ' + this.Name + ' editable. ' + ex.toString());
      }
      return this;
   };
   
   SPField.prototype.toString = function () {
      return this.Name;      
   };
   
   /*
    *   Public SPField Override Methods
    *   All of the below methods need to be implemented in each sub-class
    */
   SPField.prototype.GetValue = function () {
      throw 'GetValue not yet implemented for ' + this.Type + ' in ' + this.Name;
   },
   
   SPField.prototype.SetValue = function () {
      throw 'SetValue not yet implemented for ' + this.Type + ' in ' + this.Name;
   };

   /*
    *   SPTextField class
    *   Supports Single line of text fields
    */
   function SPTextField(fieldParams) {
      SPField.call(this, fieldParams);
      // public Textbox property
      this.Textbox = getInputControl(this);
   }

   // SPTextField inherits from the SPField base class
   SPTextField.prototype = Object.create(SPField.prototype);

   /*
    *   SPTextField Public Methods
    *   Overrides SPField class methods.
    */
   SPTextField.prototype.GetValue = function () {
      return $(this.Textbox).val();
   };
      
   SPTextField.prototype.SetValue = function (value) {
      $(this.Textbox).val(value);
      updateReadOnlyLabel(this);
      return this;
   };


   /*
    *   SPNumberField class
    *   Supports Number fields
    */
   function SPNumberField(fieldParams) {
      SPTextField.call(this, fieldParams);
   }

   // SPNumberField inherits from the SPTextField base class
   SPNumberField.prototype = Object.create(SPTextField.prototype);

   /*
    *   SPNumberField Public Methods
    *   Overrides SPTextField class methods.
    */
   SPNumberField.prototype.GetValue = function () {
      return convertStringToNumber($(this.Textbox).val());
   };

   
   /*
    *   SPCurrencyField class
    *   Supports currency fields (SPCurrencyField)
    */
   function SPCurrencyField(fieldParams) {
      SPNumberField.call(this, fieldParams);
      this.FormatOptions = {
         eventHandler: null,
         autoCorrect: false,
         decimalPlaces: 2
      };
   }

   // SPCurrencyField inherits from the SPNumberField base class
   SPCurrencyField.prototype = Object.create(SPNumberField.prototype);

   /*
    *   Overrides SPNumberField class methods.
    */
   SPCurrencyField.prototype.Format = function () {
      if (this.FormatOptions.autoCorrect) {
         this.FormatOptions.eventHandler = $.proxy(function () {
            this.SetValue(this.GetFormattedValue());
         }, this);
         $(this.Textbox).on('change', this.FormatOptions.eventHandler);
         this.FormatOptions.eventHandler(); // run once
      } else {
         if (this.FormatOptions.eventHandler) {
            $(this.Textbox).off('change', this.FormatOptions.eventHandler);
            this.FormatOptions.eventHandler = null;
         }
      }
   };
   
   SPCurrencyField.prototype.GetFormattedValue = function () {
      var text = this.GetValue();
      if (typeof text === "number") {
         text = '$' + text.formatMoney(this.FormatOptions.decimalPlaces);
      }
      return text;
   };
   
   // Override the default MakeReadOnly function to allow displaying
   // the value with currency symbols
   SPCurrencyField.prototype.MakeReadOnly = function () {
      return makeReadOnly(this, this.GetFormattedValue());
   };
   
   /*
    *   SPUtility Global object and Public Methods
    */

   window.SPUtility = {     
      Debug: function (isDebug) {
         if ('boolean' === typeof isDebug) {
            _debugMode = isDebug;
         }
         return _debugMode;
      },
   
      // Gets all of the SPFields on the page
      GetSPFields: function () {
         lazyLoadSPFields();
         return _fieldsHashtable;
      },
      
      // Searches the page for a specific field by name
      GetSPField: function (strFieldName) {
         lazyLoadSPFields();
         
         var fieldParams = _fieldsHashtable[strFieldName];
         
         if (isUndefined(fieldParams)) { 
            throw 'GetSPField: Unable to find a SPField named ' + strFieldName;
         }
         
         if (fieldParams.spField === null) {
            // field hasn't been initialized yet
            fieldParams.spField = createSPField(fieldParams);
         }
         
         return fieldParams.spField;
      },
      
      HideSPField: function (strFieldName) {
         toggleSPField(strFieldName, false);
      },
      
      ShowSPField: function (strFieldName) {
         toggleSPField(strFieldName, true);
      }
   };
}(window, jQuery));
