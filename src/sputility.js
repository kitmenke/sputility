/*
   Name: SPUtility.js
   Version: 0.8.2
   Description: 
      A JavaScript library that is used to alter SharePoint's user interface
      (mostly NewForm and EditForm). It can be used to populate fields, make
      fields read only, or hide a field from view.
   Author: Kit Menke
   http://SPUtility.codeplex.com/
   License: Microsoft Public License (see http://sputility.codeplex.com/license)
   Changelog: http://sputility.codeplex.com/wikipage?title=Changelog
*/

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
      _isSurveyForm = false; 
   
   /*
    *   SPUtility Private Methods
   **/
   
   function isUndefined(obj) {
      return typeof obj === 'undefined';
   }
   
   function isString(obj) {
      return typeof obj === 'string';
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

   //+ Jonas Raoni Soares Silva
   //@ http://jsfromhell.com/number/fmt-money [rev. #2]
   // Modified to pass JSLint
   // n = the number to format
   // c = # of floating point decimal places, default 2
   // d = decimal separator, default "."
   // t = thousands separator, default ","
   function formatMoney(n, c, d, t) {
      c = (isNaN(c = Math.abs(c)) ? 2 : c);
      d = (d === undefined ? "." : d);
      t = (t === undefined ? "," : t);
      var s = (n < 0 ? "-" : ""),
         i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "", 
         j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
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
   
   function getHashFromInputControls(spField, selector) {
      var oHash = [], i, 
         inputs = $(spField.Controls).find(selector),
         labels = $(spField.Controls).find("label");
      if (labels.length < inputs.length) {
         throw "Unable to get hashtable of controls.";
      }
      for (i = 0; i < inputs.length; i++) {
         oHash.push({
            key: $(labels[i]).text(),
            value: inputs[i]
         });
      }
      return oHash;
   }
   
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
         throw 'getSPFieldType error: ' + ex.toString();
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
      case 'SPFieldChoice':
         field = new SPDropdownChoiceField(spFieldParams);
         break;
      case 'SPFieldMultiChoice':
         field = new SPCheckboxChoiceField(spFieldParams);
         break;
      case 'SPFieldDateTime':
         field = new SPDateTimeField(spFieldParams);
         break;
      case 'SPFieldBoolean':
         field = new SPBooleanField(spFieldParams);
         break;
      case 'SPFieldUser':
      case 'SPFieldUserMulti':
         field = new SPUserField(spFieldParams);
         break;/*
      case 'SPFieldNote':
         field = new SPNoteField(spFieldParams);
         break;
      case 'SPFieldFile':
         field = new SPFileField(spFieldParams);
         break;
      case 'SPFieldURL':
         field = new SPURLField(spFieldParams);
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
         throw 'Error creating field named ' + spFieldParams.name + ': ' + e.toString();
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
         throw 'getFieldParams error getting parameters for ' + fieldName + ': ' + e.toString();
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
   
   /*
   function toggleSPField(strFieldName, bShowField) {
      lazyLoadSPFields();
         
      var fieldParams = _fieldsHashtable.get(strFieldName);
      
      if (isUndefined(fieldParams)) { 
         throw 'toggleSPField: Unable to find a SPField named ' + strFieldName + ' - ' + bShowField;
      }
      
      toggleSPFieldRows(fieldParams.labelRow, fieldParams.controlsRow, bShowField);
   }*/
   
   function updateReadOnlyLabel(spField) {
      if (spField.ReadOnlyLabel) {
         spField.ReadOnlyLabel.html(spField.GetValue());
      }
   }
   
   function makeReadOnly(spField, htmlToInsert) {
      try {
         $(spField.Controls).hide();
         if (null === spField.ReadOnlyLabel) {
            spField.ReadOnlyLabel = $('<div/>').text(htmlToInsert).addClass('sputility-readonly');
            $(spField.Controls).after(spField.ReadOnlyLabel);
         }
         spField.ReadOnlyLabel.html(htmlToInsert);
         spField.ReadOnlyLabel.show();
      } catch (ex) {
         throw 'Error making ' + spField.Name + ' read only. ' + ex.toString();
      }
      return spField;
   }
   
   function arrayToSemicolonList(arr) {
      var text = '';
      
      arr.each(function () {
         text += $(this).text() + '; ';
      });
      
      if (text.length > 2) {
         text = text.substring(0, text.length - 2);
      }
      
      return text;
   }
   
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
         $(this.Controls).hide();
         if (null !== this.ReadOnlyLabel) {
            $(this.ReadOnlyLabel).hide();
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
         text = '$' + formatMoney(text, this.FormatOptions.decimalPlaces);
      }
      return text;
   };
   
   // Override the default MakeReadOnly function to allow displaying
   // the value with currency symbols
   SPCurrencyField.prototype.MakeReadOnly = function () {
      return makeReadOnly(this, this.GetFormattedValue());
   };

   function SPChoiceField(fieldParams) {
      SPField.call(this, fieldParams);

      if (this.Controls === null) {
         return;
      }

      this.FillInTextbox = $(this.Controls).find('input[type="text"]');
      if (this.FillInTextbox.length === 1) {
         this.FillInTextbox = this.FillInTextbox[0];
         this.FillInAllowed = true;
         this.FillInElement = $(this.Controls).find('input[value="FillInButton"]')[0];
      } else {
         this.FillInAllowed = false;
         this.FillInTextbox = null;
         this.FillInElement = null;
      }
   }

   // Inherit from SPField
   SPChoiceField.prototype = Object.create(SPField.prototype);

   SPChoiceField.prototype._getFillInValue = function () {
      return this.FillInTextbox.val();
   };

   SPChoiceField.prototype._setFillInValue = function (value) {
      this.FillInTextbox.val(value);
   };

   /*
    *   SPChoiceField class
    *   Supports single select choice fields that show as either a dropdown or radio buttons
    */
   function SPDropdownChoiceField(fieldParams) {
      SPChoiceField.call(this, fieldParams);

      if (this.Controls === null) {
         return;
      }

      this.Dropdown = $(this.Controls).find('select');
      this.Dropdown = this.Dropdown.length === 1 ? this.Dropdown[0] : [];
   }

   // Inherit from SPChoiceField
   SPDropdownChoiceField.prototype = Object.create(SPChoiceField.prototype);

   SPDropdownChoiceField.prototype.GetValue = function () {
      if (this.FillInAllowed && this.FillInElement.checked === true) {
         return $(this.FillInTextbox).val();
      }
      return $(this.Dropdown).val();
   };

   SPDropdownChoiceField.prototype.SetValue = function (value) {
      var found = $(this.Dropdown).find('option[value="' + value + '"]').length > 0;
      if (!found && this.FillInAllowed) {
         if (found) {
            $(this.Dropdown).val(value);
            this.FillInElement.checked = false;
         } else {
            this.FillInElement.checked = true;
            $(this.FillInTextbox).val(value);
         }
      } else if (found) {
         $(this.Dropdown).val(value);
      }
      updateReadOnlyLabel(this);
      return this;
   };

   function SPCheckboxChoiceField(fieldParams) {
      SPChoiceField.call(this, fieldParams);

      if (this.Controls === null) {
         return;
      }

      this.Checkboxes = getHashFromInputControls(this, 'input[type="checkbox"]');

      // when fill-in is allowed, it shows up as an extra checkbox
      // remove it and set the fill-in element because it isn't a normal value
      if (this.FillInAllowed) {
         this.FillInElement = this.Checkboxes.pop().value;
      }
      
   }

   // Inherit from SPChoiceField
   SPCheckboxChoiceField.prototype = Object.create(SPChoiceField.prototype);

   SPCheckboxChoiceField.prototype.GetValue = function () {
      var values = [];
      $(this.Checkboxes).each(function (index, pair) {
         var checkbox = pair.value;
         if (checkbox.checked === true) {
            values.push(pair.key);
         }
      });
      
      if (this.FillInAllowed && this.FillInElement.checked === true) {
         values.push($(this.FillInTextbox).val());
      }
      
      return values;
   };

   SPCheckboxChoiceField.prototype.SetValue = function (value, isChecked) {
      // find the radio button we need to set in our hashtable
      var checkbox = null;
      isChecked = isUndefined(isChecked) ? true : isChecked;

      $(this.Checkboxes).each(function (index, pair) {
         if (pair.key === value) {
            checkbox = pair.value;
            return false;
         }
      });
      
      // if couldn't find the element in the hashtable
      // and fill-in is allowed, assume they meant the fill-in value
      if (null === checkbox && this.FillInAllowed) {
         checkbox = this.FillInElement;
         $(this.FillInTextbox).val(value);
      }
      
      if (null !== checkbox) {                  
         checkbox.checked = isChecked;
      }
      updateReadOnlyLabel(this);
      return this;
   };
   
   /*
	 *	SPDateTimeFieldValue class
	 *	Used to set/get values for SPDateTimeField fields
	 */
   function SPDateTimeFieldValue(year, month, day, strHour, strMinute) {
      this.Year = year;
      this.Month = month;
      this.Day = day;
      this.Hour = strHour;
      this.Minute = strMinute;
      this.IsTimeIncluded = !isUndefined(this.Hour) && !isUndefined(this.Minute);

      if (this.IsTimeIncluded) {
         if (!this.IsValidHour(this.Hour)) {
            throw 'Hour parameter is not in the correct format. Needs to be formatted like "1 PM" or "12 AM".';
         }
         if (!this.IsValidMinute(this.Minute)) {
            throw 'Minute parameter is not in the correct format. Needs to be formatted like "00", "05" or "35".';
         }
      }
   }
		
   /*
    *	SPDateTimeFieldValue Public Methods
    */

   SPDateTimeFieldValue.prototype.IsValidDate = function () {
      return !isUndefined(this.Year) && !isUndefined(this.Month) && !isUndefined(this.Day);
   };

   SPDateTimeFieldValue.prototype.IsValidHour = function (h) {
      return !isUndefined(h) && (/^([1-9]|10|11|12) (AM|PM)$/).test(h);
   };

   SPDateTimeFieldValue.prototype.IsValidMinute = function (m) {
      return !isUndefined(m) && (/^([0-5](0|5))$/).test(m);
   };

   // returns the part of a date as a string and pads with a 0 if necessary
   SPDateTimeFieldValue.prototype.PadWithZero = function (d) {
      if (isUndefined(d) || null === d) {
         return '';
      }
      if (isString(d)) {
         d = parseInt(d, 10);
         if (isNaN(d)) {
            return '';
         }
      }
      if (typeof d === 'number' && d < 10) {
         return '0' + d.toString();
      }
      return d.toString();
   };

   // transforms a date object into a string
   SPDateTimeFieldValue.prototype.GetShortDateString = function () {
      if (!this.IsValidDate()) {
         return '';
      }
      var strDate = this.PadWithZero(this.Month) + "/" +
         this.PadWithZero(this.Day) + "/" +
         this.PadWithZero(this.Year);
      return strDate;
   };

   SPDateTimeFieldValue.prototype.toString = function () {
      var str = this.GetShortDateString(), arrHour;
      if (this.IsValidHour(this.Hour) && this.IsValidMinute(this.Minute)) {
         arrHour = this.Hour.split(' ');
         str += ' ' + arrHour[0] + ':' + this.Minute + arrHour[1];
      }
      return str;
   };
   
   function SPDateTimeField(fieldParams) {
      SPField.call(this, fieldParams);
      this.DateTextbox = $(getInputControl(this));
			
      this.HourDropdown = null;
      this.MinuteDropdown = null;
      this.IsDateOnly = true;

      if (this.Controls === null) {
         return;
      }

      var timeControls = $(this.Controls).find('select');
      if (null !== timeControls && 2 === timeControls.length) {
         this.HourDropdown = $(timeControls[0]);
         this.MinuteDropdown = $(timeControls[1]);
         this.IsDateOnly = false;
      }
   }
   
   // Inherit from SPField
   SPDateTimeField.prototype = Object.create(SPField.prototype);

   SPDateTimeField.prototype.GetValue = function () {
      var strHour, strMinute, arrShortDate,
         strShortDate = this.DateTextbox.val();

      if (null !== this.HourDropdown && null !== this.MinuteDropdown) {
         strHour = this.HourDropdown.val();
         strMinute = this.MinuteDropdown.val();
      }

      arrShortDate = strShortDate.split('/');

      if (arrShortDate.length === 3) {
         return new SPDateTimeFieldValue(arrShortDate[2], arrShortDate[0], arrShortDate[1], strHour, strMinute);
      }

      // empty or invalid date
      return '';
   };
		
   SPDateTimeField.prototype.SetValue = function (year, month, day, strHour, strMinute) {
      var value = new SPDateTimeFieldValue(year, month, day, strHour, strMinute);
      this.DateTextbox.val(value.GetShortDateString());
      if (null !== this.HourDropdown && null !== this.MinuteDropdown) {
         this.HourDropdown.val(value.Hour);
         this.MinuteDropdown.val(value.Minute);
      }
      updateReadOnlyLabel(this);
      return this;
   };
   
   /*
	 *	SPBooleanField class
	 *	Supports yes/no fields (SPFieldBoolean)
	 */
   function SPBooleanField(fieldParams) {
      SPField.call(this, fieldParams);
      this.Checkbox = $(getInputControl(this));
   }
   
   // Inherit from SPField
   SPBooleanField.prototype = Object.create(SPField.prototype);

   /*
    *	SPBooleanField Public Methods
    *	Overrides SPField class methods.
    */
   SPBooleanField.prototype.GetValue = function () {
      // double negative to return a boolean value
      return !!this.Checkbox.val();
   };

   SPBooleanField.prototype.SetValue = function (value) {
      this.Checkbox.val(value);
      updateReadOnlyLabel(this);
      return this;
   };
   
   /*
	 *	SPUserField class
	 *	Supports people fields (SPFieldUser)
	 */
   function SPUserField(fieldParams) {
      SPField.call(this, fieldParams);
      
      if (this.Controls === null) {
         return;
      }

      this.spanUserField = null;
      this.upLevelDiv = null;
      this.textareaDownLevelTextBox = null;
      this.linkCheckNames = null;
      this.txtHiddenSpanData = null;

      var controls = $(this.Controls).find('span.ms-usereditor');
      if (null !== controls && 1 === controls.length) {
         this.spanUserField = controls[0];
         this.upLevelDiv = $(this.spanUserField.id + '_upLevelDiv');
         this.textareaDownLevelTextBox = $(this.spanUserField.id + '_downlevelTextBox');
         this.linkCheckNames = $(this.spanUserField.id + '_checkNames');
         this.txtHiddenSpanData = $(this.spanUserField.id + '_hiddenSpanData');
         this.GetValue = function () {
            //this.textareaDownLevelTextBox.getValue()
            return this.upLevelDiv.text();
         };

         this.SetValue = function (value) {
            if ($.browser.msie) {
               this.upLevelDiv.innerHTML = value;
               this.txtHiddenSpanData.val(value);
               this.linkCheckNames.click();
            } else { // FireFox (maybe others?)
               this.textareaDownLevelTextBox.val(value);
               this.linkCheckNames.onclick();
            }
            updateReadOnlyLabel(this);
            return this;
         };
      } else if (!isUndefined(window.SPClientPeoplePicker)) {
         // sharepoint 2013 uses a special autofill named SPClientPeoplePicker
         // _layouts/15/clientpeoplepicker.debug.js
         var pickerDiv = $(this.Controls).children()[0];
         this.ClientPeoplePicker = window.SPClientPeoplePicker.SPClientPeoplePickerDict[$(pickerDiv).attr('id')];
         this.EditorInput = $(this.Controls).find("[id$='_EditorInput']")[0];
         this.HiddenInput = $(this.Controls).find("[id$='_HiddenInput']")[0];
         this.AutoFillDiv = $(this.Controls).find("[id$='_AutoFillDiv']")[0];
         this.ResolvedList = $(this.Controls).find("[id$='_ResolvedList']")[0];
         //$('.sp-peoplepicker-userSpan')
         this.GetValue = function () {
            // look for any entries that have been resolved
            var peopleSpans = $(this.ResolvedList).find('span.ms-entity-resolved');
            if (peopleSpans.length > 0) {
               return arrayToSemicolonList(peopleSpans);
            }
            return '';
         };
         this.SetValue = function (value) {
            this.ClientPeoplePicker.AddUserKeys(value, false);
            updateReadOnlyLabel(this);
            return this;
         };
      }
   }
   
   // Inherit from SPField
   SPUserField.prototype = Object.create(SPField.prototype);


   /**
    *   SPUtility Global object and Public Methods
   **/
   function Debug(isDebug) {
      if ('boolean' === typeof isDebug) {
         _debugMode = isDebug;
      }
      return _debugMode;
   }
   
   // Searches the page for a specific field by name
   function GetSPField(strFieldName) {
      lazyLoadSPFields();
      
      var fieldParams = _fieldsHashtable[strFieldName];
      
      if (isUndefined(fieldParams)) { 
         throw 'Unable to get a SPField named ' + strFieldName;
      }
      
      if (fieldParams.spField === null) {
         // field hasn't been initialized yet
         fieldParams.spField = createSPField(fieldParams);
      }
      
      return fieldParams.spField;
   }

   // Gets all of the SPFields on the page
   /*
   function GetSPFields() {
      lazyLoadSPFields();
      return _fieldsHashtable;
   }
   
   function HideSPField(strFieldName) {
      toggleSPField(strFieldName, false);
   }
   
   function ShowSPField(strFieldName) {
      toggleSPField(strFieldName, true);
   }*/

   /**
    * Static methods
   **/
   //$.sputility = Debug;
   //$.spfield = GetSPField;
   
   var SPUtility = function (settings) {
      this._defaults = {
         debug: false
      };
      this.settings = $.extend({}, settings, this._defaults);
   };
   SPUtility.GetSPField = GetSPField;
   SPUtility.Debug = Debug;
   
   
   window.SPUtility = SPUtility;

}(window, jQuery));
