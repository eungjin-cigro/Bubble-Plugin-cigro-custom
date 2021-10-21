function(instance, properties, context) {
    
    instance.canvas.find("#holder").remove();
    var div;

    var data_dict = JSON.parse(properties.data)
	var hideColumns = properties.hide.split(",")
    var filename = properties.filename
    div = $(`
<div id="holder">
<button class="export-btn">EXCEL 다운로드</button>
<div id="sorting-table-wrapper"></div>
</div>
`);

    instance.canvas.append(div)
    instance.canvas.find("button.export-btn")
    .click(function(){
        exportFilteredData(filename, data_dict.map(function(item){
            hideColumns.forEach(function(columnName){
                delete item[columnName]
            })
            return item
        }))
    })
    
    columns = Object.keys(data_dict[0])

    data = data_dict.map(function (item) {
        var dataRow = []
        Object.keys(item).forEach(function (key) {
            dataRow.push(item[key])
        })
        return dataRow
    })


    function action(instance, columns, data, hideColumns){

        var cols = []

        columns.forEach((columnName, index) => {
            
            var col;
            col = {
                name: columnName,
                sort: {
                    compare: (a, b) => {
                        a = a.replace(/[원,%]/g, "")
                        b = b.replace(/[원,%]/g, "")
                        console.log(a, b)

                        if (a.match(/^-?\d+$/) && b.match(/^-?\d+$/)) {
                            a = parseFloat(a)
                            b = parseFloat(b)
                        }

                        if (a > b) {
                            return 1;
                        } else if (b > a) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                },
                autoWidth: false,
                hidden: hideColumns.includes(columnName),
            }

            if (columnName == "이미지") {
                col['formatter'] = function(_, row){return gridjs.html(`<img style="width: 80px" src="${row.cells[index].data}" onerror="this.onerror=null;this.src='https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1632301642383x935838146639192600%2Fno_image.png?w=192&h=192&auto=compress&dpr=1&fit=max'"/>`)}
            }

            if (!hideColumns.includes(col.name)) cols.push(col)

        });

        var grid = new gridjs.Grid({
            data: data,
            columns: cols,
            sort: properties.sortable,
            search: properties.searchable,
            resizable: properties.resizable,
            pagination: {
                enabled: true,
                limit: 10,
                summary: false
            },
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
                    'min-width': '100px',
                    'padding': '8px 16px',
                    'color': 'rgb(31,41,48)',
                    'cursor': 'pointer',
                    'text-align': 'center'
                }
            }
        }).render(instance.canvas.find("#sorting-table-wrapper")[0]);

        grid.on('rowClick', function (...args) {
            clickedData = args[1]['cells'].map(item => item.data)
            searched = data_dict.find(function (element) {
                dataRow = []
                Object.entries(element).forEach(function (item) {
                    if (!hideColumns.includes(item[0])) dataRow.push(item[1])
                })
                return JSON.stringify(dataRow) == JSON.stringify(clickedData)
            })

            var idColumnNames = properties.idColumnNames.split(",")

            var id1 = searched[idColumnNames[0]]
            var id2 = searched[idColumnNames[1]]
            var id3 = searched[idColumnNames[2]]
            var id4 = searched[idColumnNames[3]]
            instance.publishState('id1', id1)
            instance.publishState('id2', id2)
            instance.publishState('id3', id3)
            instance.publishState('id4', id4)
            instance.triggerEvent('cigro_row_clicked', function () {});
        });
        
        var checkExist = setInterval(function() {
            var rowElements = instance.canvas.find('tbody tr.gridjs-tr')
            if (rowElements.length > 0) {
                instance.publishState('is_loaded', 'yes')
                clearInterval(checkExist);
            }
        }, 500)
    }
    context.async(action(instance, columns, data, hideColumns))  


}