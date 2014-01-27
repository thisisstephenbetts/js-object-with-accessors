// Simple Object framework, based on
//  http://ejohn.org/blog/simple-javascript-inheritance/
//  Includes inheritance, in instance and class methods, 
//  and including (as per John Resig's example) access to super methods.

// The base Class implementation (does nothing)
this.Class = function Class(){};

// Not actually called for Class itself!
Class.class_init = function(class_props) {
	var class_props = class_props || {};
	var parent = this._parent_class || Class;
  var _super = parent.prototype;


	// console.log(eval("classname"),window[classname])
	for (var inherited_class_method in parent) {
		if (typeof parent[inherited_class_method] === "function") {
			if (!this[inherited_class_method]) {
				this[inherited_class_method] = parent[inherited_class_method];
			}
		}
	}

	var class_methods = class_props.class_methods || {};
	for (var name in class_methods) {
		this[name] = this.wrapMethodIfUsesSuper(class_methods[name],parent[name]);
	}


	var instance_methods = this.get_instance_methods(class_props);
  // Copy the properties over onto the new prototype
  for (var name in instance_methods) {
    // Check if we're overwriting an existing function
    this.prototype[name] = this.wrapMethodIfUsesSuper(instance_methods[name], _super[name]);
  }

  // Enforce the constructor to be what we expect
	this.prototype.constructor = this;

};

Class.get_instance_methods = function(props) {
	
	var instance_methods = {};
	for (var key in props || {}) {
		// Any functions in props should be instance methods
		console.log(key, typeof props[key])
		if (typeof props[key] === "function") {
			instance_methods[key] = props[key];
		}
	}
	return instance_methods;
}

Class.wrapMethodIfUsesSuper = function(native_method, inherited_method) {
	var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/
	return typeof native_method == "function" && 
				 typeof inherited_method == "function" && 
				 fnTest.test(native_method) ?
		this.wrapped_method(native_method, inherited_method) :
	  native_method;
};
Class.wrapped_method = function(defined_method, inherited_method) {

	return function() {
    var tmp = this._super;

    // Add a new ._super() method that is the same method
    // but on the super-class
    this._super = inherited_method;

    // The method only need to be bound temporarily, so we
    // remove it when we're done executing
    var ret = defined_method.apply(this, arguments);        
    this._super = tmp;

    return ret;
  };	
};


(function(){
  var initializing = false;
  
  // Create a new Class that inherits from this class
  Class.createSubclass = function(classname,class_props) {
		class_props = class_props || {};

		var parent = this;
		eval(
			"function "+classname+"() { "+
				// All construction is actually done in the init method
		    "if ( !initializing && this.init ) {"+
		    "    this.init.apply(this, arguments);"+
		    "}"+
			"};"+
			"window."+classname+" = "+classname+";"
		);
		window[classname]._parent_class = parent;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
		window[classname].prototype = new parent();
    initializing = false;
		
		// This will probably get processed twice 
		var class_init = (typeof (class_props.class_methods || {}).class_init === "function") ? 
				Class.wrapMethodIfUsesSuper(
						class_props.class_methods.class_init,parent.class_init) :
				parent.class_init;

		class_init.call(window[classname],class_props);
		
		return window[classname];
  }
	
})();

