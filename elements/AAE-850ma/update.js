function(instance, properties, context) {
    var div;
    instance.canvas.find("div").remove()
    instance.publishState('is_loaded', 'no')
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    id = makeid(10)

    context.id = id
    console.log(id)  


    div = $('<div id="'+id+'"></div>');
    instance.canvas.append(div)

    data = JSON.parse(properties.data)
    roas_on = properties.roas_on
    all_in_one = properties.all_in_one
    
    function action(data){
        series = [];
        xcategories = data.at(0).data.map((element) => +new Date(element.date));

        data.forEach((element) => {
            item = {
                name: element.name,
                data: element.data.map((element) => element.value),
            };
            series.push(item);
        });
        var options = {
            chart: {
                type: "area",
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
                fontFamily: "Noto Sans KR",
                foreColor: "#000000",
                width: "100%",
                height: "100%",
            },
            series: series,
            stroke: {
                curve: "straight",
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                type: "datetime",
                categories: xcategories,
                tooltip: {
                    enabled: false,
                },
                labels: {
                    format: "MM-dd",
                    formatter: undefined,
                    style: {
                        color: "#252525",
                        fontSize: "10px",
                        cssClass: "apexcharts-xaxis-label",
                    },
                },
            },

            yaxis: {
                labels: {
                    formatter: function (value) {
                        return (
                            value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "\u00A0" +
                            "\u00A0" +
                            "\u00A0"
                        );
                    },
                    style: {
                        fontSize: "10px",
                        cssClass: "apexcharts-yaxis-label",
                    },
                },
            },

            colors: [
                "#E477FB",
                "#FFC148",
                "#7AFF90",
                "#9FE2BF",
                "#40E0D0",
                "#DFFF00",
                "#FF7F50",
                "#CCCCFF",
                "#DE3163",
                "#6495ED",
            ],

            tooltip: {
                enabled: true,
                followCursor: true,
                x: {
                    format: "MM-dd",
                    formatter: undefined,
                },
                y: {
                    formatter: function (value) {
                        if(all_in_one) {
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        else {
                            if (roas_on) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
                            }
                            else {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
                            }
                        }
                    },
                },

                yaxis: {
                    labels: {
                        formatter: (value) => {
                            if(all_in_one) {
                                return value;
                            }
                            else {
                                if (roas_on) {
                                    return value + "%";
                                }
                                else {
                                    return value + "원";
                                }
                            }
                        },
                    },
                },
            },

            grid: {
                show: true,
                borderColor: "#e8e8e8",
                strokeDashArray: 0,
                position: "back",
                xaxis: {
                    lines: {
                        show: false,
                        offsetX: 10,
                        offsetY: 10,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                        offsetX: 10,
                        offsetY: 10,
                    },
                    min: 0,
                    max: 100,
                },
                padding: {
                    top: 0,
                    right: 30,
                    bottom: 0,
                    left: 0,
                },
            },

            legend: {
                show: true,
                showForSingleSeries: false,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "10px",
                fontWeight: 400,
                formatter: undefined,
                inverseOrder: false,
                width: undefined,
                height: undefined,
                tooltipHoverFormatter: undefined,
                customLegendItems: [],
                offsetX: 0,
                offsetY: 0,
                labels: {
                    colors: undefined,
                    useSeriesColors: false,
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 15,
                },
                onItemClick: {
                    toggleDataSeries: true,
                },
                onItemHover: {
                    highlightDataSeries: true,
                },
            },

            fill: {
                colors: undefined,
                opacity: 0.1,
                type: "solid",
                gradient: 0,
            },
        };

        var chart = new ApexCharts(document.querySelector("#"+id), options);
        chart.render();
        instance.publishState('is_loaded', 'yes')
    }


    context.async(action(data))  
}