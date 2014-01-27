ObjectWithAccessors.createSubclass('JQElementWrapper',{
	accessors:['$'],
	init: function(args) {

		if (this._super(args) === false) { return false }
		this.$($(this.original_html()));

		this.$().data('o',this)
	},
	original_html: function() {
		return '<div />';
	}
});

(function() { var dummy = new JQElementWrapper() })();

(function( $ ){
	$.fn.$$ = function() {
		return this.data('o');
	};
})( jQuery );
