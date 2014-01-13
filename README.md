# SPUtility.js (jQuery version)

A JavaScript library used to make modifications to SharePoint's list forms 
(NewForm.aspx and EditForm.aspx in a survey, custom list or library). 
SPUtility.js works with SharePoint 2007, 2010, and 2013.

This library depends on jQuery (tested with v1.9.0). I recommend using
version 1.x of jQuery in order to support older versions of IE. 

The Prototype.js version of SPUtility is located on Codeplex:
http://sputility.codeplex.com/

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/kitmenke/sputility/master/dist/sputility.min.js
[max]: https://raw.github.com/kitmenke/sputility/master/dist/sputility.js

Upload jQuery and SPUtility into a Document Library in your SharePoint site.

Edit the SharePoint form you wish to modify and add a Content Editor Web Part 
with the following script inside of it:

```html
<script src="/site/Files/jquery.js"></script>
<script src="/site/Files/sputility.min.js"></script>
<script>
$(window).load(function () {
   // TODO: Your scripts go here!

   // EXAMPLE: Set the value of the Title field to Hello world!
   SPUtility.GetSPField('Title').SetValue('Hello world!');
});
</script>
```

## Documentation
For now, please use the old documentation here:
https://sputility.codeplex.com/documentation

## Examples
```javascript
// Set the value of the Title field to Hello world!
SPUtility.GetSPField('Title').SetValue('Hello world!');

// Get the value of the Title field
SPUtility.GetSPField('Title').GetValue(); // returns "Hello world!"

// Make the Title field read only
SPUtility.GetSPField('Title').MakeReadOnly();

// Hide the entire row from view
SPUtility.GetSPField('Title').Hide();

// You can also set a variable to the returned field
var fTitle = SPUtility.GetSPField('Title');
fTitle.SetValue('Using my variable!');
```

## Release History
_No release yet. If you are feeling brave, you can grab the latest development
version from the dist folder._
