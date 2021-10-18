function(instance, context) {
    var div;
    
    div = $('<div></div>');
    instance.canvas.append(div)
    
    instance.publishState('is_loaded', 'no')
}