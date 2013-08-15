# SPUtility.js (work in progress)

A jquery plugin to modify SharePoint list forms.

This version is a port of the original prototype.js version: http://sputility.codeplex.com/

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/kitmenke/jquery.sputility/master/dist/sputility.min.js
[max]: https://raw.github.com/kitmenke/jquery.sputility/master/dist/sputility.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/sputility.min.js"></script>
<script>
// Set the value of the Title field to Hello world!
SPUtility.GetSPField('Title').SetValue('Hello world!');

// Get the value of the Title field
SPUtility.GetSPField('Title').GetValue(); // returns "Hello world!"

// Make it so the user can't edit the Title field
SPUtility.GetSPField('Title').MakeReadOnly();

// Hide the entire row from view
SPUtility.GetSPField('Title').Hide();

// You can also set a variable to the returned field
var fTitle = SPUtility.GetSPField('Title');
fTitle.SetValue('Using my variable!');
</script>
```

## Documentation
The cor

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
