function(instance, context) {
    var div;

    div = $('<div id="wrapper"></div>');
    instance.canvas.append(div)
	instance.publishState('is_loaded', 'no')
    
}