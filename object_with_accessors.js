// Dynamic object creation from simple properties list, with inheritance.
//  Example of use below

// Also using http://ejohn.org/blog/simple-javascript-inheritance/ 

// // Just to keep things slightly neater.
// ObjectWithAccessors.addAccessors = function(o,acc) {
// 	if (!o['_accessors']) { o['_accessors']=[] }
// 	o['_accessors'] = o['_accessors'].concat(acc);
// }

// // Could make parent optional (defaulting to ObjectWithAccessors), but you
// //  need to mess around the other declarations so much anyway, may as well
// //  just leave it in.
// ObjectWithAccessors.createClassWithAccsFromParent = function(o,acc,parent_constructor) {
// 	ObjectWithAccessors.addAccessors(o,acc);
// 	// TODO - perhaps use apply, so you can have multiple parameters
// 	parent_constructor.call(o,arguments[3]);
// }

// Slightly worried about using global window object, but no matter.

Class.createSubclass('ObjectWithAccessors',{
	init: function(params) {
		this.setup_accessors();
		if (params === false) {return false}
		this.init_vars(params);
	},
	setup_accessors: function() {
		var accessors = this._accessors;
		var that=this;
		$.each(accessors,function(i,acc_method) {
			var int_var = '_'+acc_method;
			var acc_prototype = window[that.constructor.name].prototype[acc_method];
			if (!acc_prototype) {
				window[that.constructor.name].prototype[acc_method] = function() {
					if (arguments.length > 0) {
						this[int_var]=arguments[0];
					}
					return this[int_var];
				}
			}
		});		
	},
	'_accessors': [],
	default_params: function() { return {}; },

	// Doesn't feel like an instance method
	add_defaults_to_params: function(params) {
		// var params = (args || {});
		// console.log(arguments.callee.name)
		var defaults = this.default_params();

		for (var v in defaults) {
			if (params[v] === undefined && defaults[v] !== undefined) { 
				params[v] = defaults[v];
			}
		}
	},
	
	init_vars: function(params) {
		this.add_defaults_to_params(params || {});

		var that = this;
		$.each(params || [],function(k,v) {
			if (that[k] !== undefined) { that[k](v); }
		});	
	}
	
})

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
