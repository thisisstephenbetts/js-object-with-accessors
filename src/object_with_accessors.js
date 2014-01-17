// Dynamic object creation from simple properties list, with inheritance.
//  Example of use below

// Also using http://ejohn.org/blog/simple-javascript-inheritance/ 

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.ObjectWithAccessors = function ObjectWithAccessors(){};
  
  // Create a new Class that inherits from this class
  ObjectWithAccessors.createSubclass = function(classname,class_props) {
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
				typeof class_methods[name] == "function" && 
				fnTest.test(class_methods[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;
          
          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];
          
          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);        
          this._super = tmp;
          
          return ret;
        };
      })(name, class_methods[name]) :
      class_methods[name];
		}
		
		window[classname]._parent_class = parent;

		var defaults = parent.default_params || {};
		for (var param in class_props.default_params) {
			defaults[param] = class_props.default_params[param];
		}
		window[classname].default_params = defaults;

		var instance_methods = class_props.instance_methods || {};

		var accessors = class_props.accessors || [];
		for (var i=0; i<accessors.length; i++) {
			var  acc_method = accessors[i];
			instance_methods[acc_method] = 
					this.create_accessor('_'+accessors[i]);
		}
		
    // Copy the properties over onto the new prototype
    for (var name in instance_methods || {}) {
      // Check if we're overwriting an existing function
      prototype[name] = 
					typeof instance_methods[name] == "function" && 
	        typeof _super[name] == "function" && 
					fnTest.test(instance_methods[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, instance_methods[name]) :
        instance_methods[name];
    }

    // Enforce the constructor to be what we expect
		prototype.constructor = window[classname];
    // Populate our constructed prototype object
		window[classname].prototype = prototype;

				
  }

	ObjectWithAccessors.prototype.init = function(params) {
		if (params === false) {return false}
		this.init_vars(params);
	};
	
	ObjectWithAccessors.prototype.add_defaults_to_params = function(params) {

		var defaults = this.constructor.default_params;
		for (var v in defaults) {
			if (params[v] === undefined && defaults[v] !== undefined) { 
				params[v] = defaults[v];
			}
		}
	};
	
	ObjectWithAccessors.prototype.init_vars = function(params) {
		params = params || {};
		this.add_defaults_to_params(params);
		
		var that = this;
		for (var k in params || {}) {
			if (that[k] !== undefined) { that[k](params[k]); }			
		}
	};
})();

ObjectWithAccessors.default_params = {};

ObjectWithAccessors.create_accessor = function(var_name) {
	return function () {
		if (arguments.length > 0) {
			this[var_name]=arguments[0];
		}
		return this[var_name];		
	}
}


// // Example Usage
// ObjectWithAccessors.createSubclass('SubClass',{
// 	init: function(args) { this._super(args) },
// 	'_accessors': ['first','second','third']
// });
// // Overriding defined method
// SubClass.prototype.another = function() {
// 	return 'another method in class '+this.constructor.name
// }
// 
// SubClass.createSubclass('SubSubClass',{
// 	init: function(args) { this._super(args) },
// 	'_accessors': ['fourth']
// });
//   	
// // Overriding defined method
// SubSubClass.prototype.second = function() {
// 	return 'Overridden "second" method'
// }
// 
// //Defining new method
// SubSubClass.prototype.extra_method = function() {
// 	return 'New method SubSubClass#extra_method'
// }
// 
// var a = new SubClass;
// var a2 = new SubClass({first: 'A', second: 'B', third: 'C'});
// var b = new SubSubClass;
// var b2 = new SubSubClass({first: 'b2 first', second: 'b2 second', third: 'b2 third', fourth: 'b2 fourth'});;
// 
// a.first('a 1st');
// a.second('a 2nd');
// 
// console.log('a.first(): '+ a.first())
// console.log('a.second(): '+ a.second())
// console.log('a.third(): '+ a.third())
// console.log('a.another(): '+ a.another())
// console.log('a2.first(): '+a2.first())
// console.log('a2.second(): '+a2.second())
// console.log('a2.third(): '+a2.third())
// console.log('a2.another(): '+ a2.another())
// 
// b.first('b 1st');
// b.second('b 2nd');
// b.third('b 3rd');
// b.fourth('b 4th');
// b.extra_method('b extra');
// 
// console.log('b.first(): '+b.first())
// console.log('b.second(): '+b.second())
// console.log('b.third(): '+b.third())
// console.log('b.fourth(): '+b.fourth())
// console.log('b.extra_method(): '+b.extra_method())
// console.log('b.another(): '+ b.another())
// 
// 
// console.log('b2.first(): '+b2.first())
// console.log('b2.second(): '+b2.second())
// console.log('b2.third(): '+b2.third())
// console.log('b2.fourth(): '+b2.fourth())
// console.log('b2.extra_method(): '+b2.extra_method())
// console.log('b2.another(): '+ b2.another())
// 
// console.log("a instanceof SubClass: "+(a instanceof SubClass))
// console.log("a instanceof SubSubClass: "+(a instanceof SubSubClass))
// console.log("b instanceof SubClass: "+   (b instanceof SubClass))
// console.log("b instanceof SubSubClass: "+(b instanceof SubSubClass))

