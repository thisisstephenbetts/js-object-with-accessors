// Dynamic object creation from simple properties list, with inheritance.
Class.createSubclass('ObjectWithAccessors', {
	instance_methods: {
		init_vars: function(params) {
			params = params || {};
			this.add_defaults_to_params(params);

			var that = this;
			for (var k in params || {}) {
				if (that[k] !== undefined) { that[k](params[k]); }			
			}
		},
		init: function(params) {
			if (params === false) {return false}
			this.init_vars(params);
		},
		add_defaults_to_params: function(params) {

			var defaults = this.constructor.default_params;
			for (var v in defaults) {
				if (params[v] === undefined && defaults[v] !== undefined) { 
					params[v] = defaults[v];
				}
			}
		}
	},
	class_methods: {
		class_init: function(props) {
			this._super(props);

			var defaults = this._parent_class.default_params || {};
			for (var param in props.default_params) {
				defaults[param] = props.default_params[param];
			}
			this.default_params = defaults;

			var accessors = props.accessors || [];
			for (var i=0; i<accessors.length; i++) {
				var  acc_method = accessors[i];
				if (typeof this.prototype[acc_method] !== "function") {
					this.prototype[acc_method] = this.create_accessor('_'+acc_method);					
				}
			}
		},
		create_accessor: function(var_name) {
			return function () {
				if (arguments.length > 0) {
					this[var_name]=arguments[0];
				}
				return this[var_name];		
			}
		}
		
	}
});


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

