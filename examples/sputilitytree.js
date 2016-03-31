function SPUtilityTreeNode(parent, name, value) {
   // parent node (SPUtilityTreeNode)
   this.parent = parent;
   // field's display name, used to get SPField
   this.name = name;
   // show this node when the value here matches the parent field's value
   this.value = value;
   // SPUtility.js SPField class
   this.field = SPUtility.GetSPField(name);
   // array of dependent nodes (SPUtilityTreeNode)
   this.childNodes = [];
   // callback function which shows or hides dependent fields
   this.callback = this._showOrHideFieldsCallback.bind(this);
   // schedule callback for when they change the field
   // TODO: only works for dropdown fields right now
   $(this.field.Dropdown).change(this.callback);
}
SPUtilityTreeNode.prototype._hideNodeAndChildren = function (node) {
   // when field is hidden, hide all dependent children as well
   node.field.Hide();
   for (var i = 0; i < node.childNodes.length; i++) {
      // recurse down the tree to hide all children
      this._hideNodeAndChildren(node.childNodes[i]);
   }
};
SPUtilityTreeNode.prototype._showNodeAndChildren = function (node) {
   // when field is visible, re-evaluate all the children
   // to determine whether to Show or Hide them
   node.field.Show();
   node.callback();
};
SPUtilityTreeNode.prototype._getOrCreateChild = function (name, value) {
   for (var i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].name === name && this.childNodes[i].value === value) {
         // found matching child node
         return this.childNodes[i];
      }
   }
   var newNode = new SPUtilityTreeNode(this, name, value);
   this.childNodes.push(newNode);
   return newNode;
};
SPUtilityTreeNode.prototype._showOrHideFieldsCallback = function () {
   var value = this.field.GetValue();
   // go through each dependent child node
   // and show/hide it based on the field's value
   for (var i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].value === value) {
         this._showNodeAndChildren(this.childNodes[i]);
      } else {
         this._hideNodeAndChildren(this.childNodes[i]);
      }
   }
};
SPUtilityTreeNode.prototype.addChildNode = function (name, value) {
   var childNode = this._getOrCreateChild(name, value);
};
function SPUtilityTree(name) {
   this.root = new SPUtilityTreeNode(null, name);
   this.currentNode = null;
   this.currentValue = null;
}
SPUtilityTree.prototype._findNode = function (node, searchName) {
   if (node.name === searchName) {
      return node;
   }
   // search the children
   for (var i = 0; i < node.childNodes.length; i++) {
      var foundNode = this._findNode(node.childNodes[i], searchName);
      if (foundNode !== null) {
         return foundNode;
      }
   }
   return null;
};
// select a node in the tree
SPUtilityTree.prototype.whenField = function (fieldName) {
   // reset currentNode before searching
   this.currentNode = this._findNode(this.root, fieldName);
   if (this.currentNode === null) {
      console.log('ERROR: Field ' + fieldName + ' was not found in the tree!');
   }
   return this;
};

SPUtilityTree.prototype.hasValue = function (fieldValue) {
   this.currentValue = null;
   if (this.currentNode === null) {
      console.log('ERROR: Current node is not set, call whenField first.');
      return this;
   }
   this.currentValue = fieldValue;
   return this;
};

SPUtilityTree.prototype.showFields = function (fieldNames, fieldValue) {
   // add a dependent child node
   for (var i = 0; i < fieldNames.length; i++) {
      this.currentNode.addChildNode(fieldNames[i], this.currentValue);
   }
};
SPUtilityTree.prototype.print = function (str, node, level) {
   var spacing = '';
   for (var i = 0; i < level; i++) {
      spacing += "  "
   }
   str += spacing + level + ') ' + node.name + '\n';
   for (var i = 0; i < node.childNodes.length; i++) {
      str = this.print(str, node.childNodes[i], level+1);
   }
   return str;
};
SPUtilityTree.prototype._executeCallbacks = function (node) {
   if (node.callback !== null) {
      node.callback();
   }
   for (var i = 0; i < node.childNodes.length; i++) {
      this._executeCallbacks(node.childNodes[i]);
   }
};
SPUtilityTree.prototype.build = function () {
   console.log("Building tree...");
   console.log(this.print('', this.root, 0));
   console.log("Executing callbacks...")
   this._executeCallbacks(this.root);
};
