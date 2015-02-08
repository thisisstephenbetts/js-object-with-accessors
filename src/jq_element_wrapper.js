GLOBAL_ID=0
ObjectWithAccessors.createSubclass('JQElementWrapper',{
	accessors:['jqew_id'],
	init: function(args) {

		if (this._super(args) === false) { return false }
    this.set_jqew_id()

		var this_element = $(this.original_html());
		this_element.attr({'data-jqew-id': this.jqew_id()})
		this_element.data('o',this)
		
		var limbo = this.get_or_create_element_limbo();
    limbo.append(this_element);

	},
	$: function() {
    // console.log('looking for '+this.jqew_id());
    var jq_elem = $('[data-jqew-id='+this.jqew_id()+']');
    if (!jq_elem.length) {
      throw "Couldn't find anything with jqew-id of: "+this.jqew_id()
    }
	  return jq_elem;
	},
	get_or_create_element_limbo: function() {
		var limbo = $('#jqew-limbo')
    return (limbo.length) ?
        limbo :
        $('body').append('<div id="jqew-limbo" style="display:none" />')
	},
	set_jqew_id: function() {
    GLOBAL_ID+=1;
	  this.jqew_id('jqew-id-'+GLOBAL_ID.toString(36));
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
