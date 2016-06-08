/**
 * Created by WaTer on 2016/6/8.
 */

var myChart = echarts.init(document.getElementById('main'))
var option = {};
var option_component_select = $("select"),
    option_component_input = $("input");
var dataNames = $(".dynamic-data-group .data-name"),
    dataValues = $(".dynamic-data-group .data-value"),
    dynamicDataGroup = $(".dynamic-data-group");
var addBtn = $("#add-btn"),
    deleteBtns = $(".delete-btn");

$(function(){
    refreshChart();

    option_component_select.change(function(){
        refreshChart();
    });
    $(".container-fluid").delegate("input","keyup",function(){
        refreshChart();
    })
    dynamicDataGroup.delegate(".delete-btn","click",function(){
        $(this).closest(".dynamic-data-item").remove();
        refreshChart();
    });
    addBtn.click(function(){
        var index = dataValues.length + 1;
        //创建元素
        var dynamicDataItem = "<div class=\"dynamic-data-item\">"
            + "<label for=\"\" class=\"col-sm-1 control-label\">" + index + "</label>"
            + "<div class=\"col-sm-5\">"
            + "<input type=\"text\" class=\"form-control data-value\" value=\"\">"
            + "</div>"
            + "<div class=\"col-sm-5\">"
            + "<input type=\"text\" class=\"form-control data-name\" value=\"\">"
            + "</div>"
            + "<div class=\"col-sm-1\">"
            + "<button class=\"btn btn-xs btn-danger delete-btn\" type=\"buttton\" title=\"删除该条数据\">删除</button>"
            + "</div>"
            + "</div>";

        dynamicDataGroup.append(dynamicDataItem);
    });
});

/**
 * 刷新图表
 */
function refreshChart() {

    var _option = {};
    var title = {};
    var legend = {};
    var series = [];
    var serie_pie = {};

    title.text = $("#title-text").val();
    title.subtext = $("#title-subtext").val();
    title.x = $("#title-x").val();

    legend.orient = $("#legend-orient").val();
    legend.left = $("#legend-left").val();
    legend.data = $("#legend-data").val().split(",");

    serie_pie.type = 'pie';
    packageSerieData(serie_pie);

    series[0] = serie_pie;

    _option.title = title;
    _option.legend = legend;
    _option.series = series;

    myChart.setOption(_option);
}

function packageSerieData(serie) {
    dataValues = $(".dynamic-data-group .data-value");
    dataNames = $(".dynamic-data-group .data-name");
    var length = dataValues.length;

    serie.data = [];

    for (var i = 0; i < length; i++) {
        var dataItem = {};
        dataItem.name = dataNames.get(i).value;
        dataItem.value = parseInt(dataValues.get(i).value);
        serie.data[i] = dataItem;
    }
}