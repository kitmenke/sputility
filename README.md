# This project is no longer being maintained. The final release of SPUtility.js is 0.14.2.

# SPUtility.js

A JavaScript library used to make modifications to SharePoint's list forms
(NewForm.aspx and EditForm.aspx in a survey, custom list or library).
SPUtility.js works with SharePoint 2007, 2010, and 2013.

This library depends on jQuery (tested with v1.9.0+). I recommend using
version 1.x of jQuery in order to support older versions of IE.

## Usage

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

Step by step install instructions are located here: https://github.com/kitmenke/sputility/blob/master/WikiFiles/docs/Installation.md

## Documentation

Documentation was migrated from Codeplex to Markdown files in this repo: https://github.com/kitmenke/sputility/blob/master/WikiFiles/docs/

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

## For Developers Getting Started

SPUtility.js uses [Grunt](http://gruntjs.com/) to run tests, check code syntax, and compress/minify/uglify files for use in production.

[Install node.js and npm](https://docs.npmjs.com/getting-started/installing-node).

Install grunt:
```
npm install -g grunt-cli
npm install grunt
```
Install git and clone SPUtility.js:
```
git clone https://github.com/kitmenke/sputility.git
```
Install SPUtility.js dependencies:
```
cd sputility
npm install
```

If everything went ok, you should be able to run `grunt` in the sputility directory.

Executing grunt will run all of the tasks (jshint, qunit, uglify). Or, you can run them individually, for example: `grunt jshint` will run just the unit tests.

## Contributing
This project is no longer maintained so contributions are no longer accepted.

## Release History
https://github.com/kitmenke/sputility/blob/master/WikiFiles/docs/Changelog.md

## License
MIT
