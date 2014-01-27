// Dynamic object creation from simple properties list, with inheritance.
Class.createSubclass('ObjectWithAccessors', {
	init: function(params) {
		if (params === false) {return false}
		this.init_vars(params);
	},
	init_vars: function(params) {
		params = params || {};

		this.add_defaults_to_params(params);

		var that = this;
		for (var k in params || {}) {
			if (that[k] !== undefined) { 
				that[k](params[k]); 
			} else {
				this.handle_parameter_error(
					"Unrecognized parameter in object initialization for class "+this.constructor.name+": "+k+"(value: "+params[k]+")");
			}
		}
	},
	add_defaults_to_params: function(params) {

		var defaults = this.constructor.default_params;
		for (var v in defaults) {
			if (params[v] === undefined && defaults[v] !== undefined) { 
				params[v] = defaults[v];
			}
		}
	},
	handle_parameter_error: function(message) {
		// console.warn(message)
		throw new ObjectWithAccessorsParameterError(message);
	},
	class_methods: {
		class_init: function(props) {
			this._super(props);

			var defaults = {};
			
			var inherited_defaults = this._parent_class.default_params || {};
			for (var k in  inherited_defaults) {
				defaults[k] = inherited_defaults[k];
			}
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

function ObjectWithAccessorsParameterError(message) {
	this.message = message;
}
ObjectWithAccessorsParameterError.prototype = new Error();
