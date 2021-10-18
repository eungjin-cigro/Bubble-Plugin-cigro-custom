function(instance, properties, context) {
    instance.publishState('is_loaded', 'no')
    
    instance.canvas.find("#wrapper").remove();
    var div;

    div = $('<div id="wrapper"></div>');
    instance.canvas.append(div)

    dict = JSON.parse(properties.data)

    columns = dict.columns
    data = dict.data

    console.log(columns)
    console.log(data)


    function action(instance, columns, data){

        cols = []

        columns.forEach(columnName => {
            const col = {
                name: columnName
            }
            cols.push(col)
        });
        //console.log(data)

        new gridjs.Grid({
            data: data,
            columns: cols,
            sort: false,
            search: false,
            style: {
                container: {
                    'box-shadow': 'none',
                },
                table: {
                    'box-shadow': 'none',
                    'border': '1px solid rgba(223, 228, 235, 1)',
                    'color': 'rgba(133, 142, 148, 1)',
                    'background-color': 'rgba(252, 254, 255, 10)',
                    'font-family': 'Noto Sans KR',
                    'font-size': '14px'
                },

                td: {
                    'min-width': '120px',
                    'padding': '12px 16px',
                    'color': 'rgb(31,41,48)'
                }
            }
        }).render(instance.canvas.find("#wrapper")[0]);
        instance.publishState('is_loaded', 'yes')
    
    }
    context.async(action(instance, columns, data)) 
}