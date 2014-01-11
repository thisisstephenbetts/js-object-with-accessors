ObjectWithAccessors.createSubclass('JQElementWrapper',{
	_accessors:['$'],
	init: function(args) {

		if (this._super(args) === false) { return false }
		this.$($(this.elem_html()));

		this.$().data('o',this)
	},
	elem_html: function() {
		return '<div />';
	}
});

(function() { var dummy = new JQElementWrapper() })();

(function( $ ){
	$.fn.$$ = function() {
		return this.data('o');
	};
})( jQuery );
