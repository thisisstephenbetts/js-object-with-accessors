// Simple Object framework, based on
//  http://ejohn.org/blog/simple-javascript-inheritance/
//  Includes inheritance, in instance and class methods, 
//  and including (as per John Resig's example) access to super methods.

(function(){
  var initializing = false;
  // The base Class implementation (does nothing)
  this.Class = function Class(){};
  
  // Create a new Class that inherits from this class
  Class.createSubclass = function(classname,class_props) {
		var parent = this;

    var _super = parent.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new parent();
    initializing = false;

		eval(
			"function "+classname+"() { "+
				// All construction is actually done in the init method
		    "if ( !initializing && this.init ) {"+
		    "    this.init.apply(this, arguments);"+
		    "}"+
			"};"+
			"window."+classname+" = "+classname+";"
		);
		
		// console.log(eval("classname"),window[classname])
		for (var inherited_class_method in parent) {
			if (typeof parent[inherited_class_method] === "function") {
				window[classname][inherited_class_method] = parent[inherited_class_method];
			}
		}

		var class_methods = class_props.class_methods || {};
		for (var name in class_methods) {
			window[classname][name] =
					this.wrapMethodIfUsesSuper(name,class_methods,parent);
		}
		
		window[classname]._parent_class = parent;

		var instance_methods = class_props.instance_methods || {};
    // Copy the properties over onto the new prototype
    for (var name in instance_methods) {
      // Check if we're overwriting an existing function
      prototype[name] = this.wrapMethodIfUsesSuper(name, instance_methods, _super);
    }

    // Enforce the constructor to be what we expect
		prototype.constructor = window[classname];

    // Populate our constructed prototype object
		window[classname].prototype = prototype;

		if (typeof window[classname].class_init === "function") {
			window[classname].class_init.call(window[classname],class_props);
		}
		
  }
	
})();


Class.wrapMethodIfUsesSuper = function(name, native_methods, inherited_methods) {
	var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/
	return typeof native_methods[name] == "function" && 
				 typeof inherited_methods[name] == "function" && 
				 fnTest.test(native_methods[name]) ?
		this.wrapped_method(native_methods[name], inherited_methods[name]) :
	  native_methods[name];
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
}
