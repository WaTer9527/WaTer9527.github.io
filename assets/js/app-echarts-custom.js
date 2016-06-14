/**
 * Created by WaTer on 2016/6/8.
 */

var canvasContainer = $("#main");
var myChart;
var option = {};
var option_component_select = $("select"),
    option_component_input = $("input"),
    option_component_checkbox = $("input[type=checkbox]");
    option_component_range = $("#series-radius");
var dataNames = $(".dynamic-data-group .data-name"),
    dataValues = $(".dynamic-data-group .data-value"),
    dataItem = $(".dynamic-data-group .dynamic-data-item"),
    dynamicDataGroup = $(".dynamic-data-group");
var addBtn = $("#add-btn"),
    deleteBtns = $(".delete-btn"),
    downloadBtn = $("#downloadBtn");

$(function(){

    refreshChart();

    option_component_select.change(function(){
        refreshChart();
    });
    option_component_checkbox.change(function () {
        refreshChart();
    });
    option_component_range.on("change",null,null,function(){
        refreshChart();
    });
    $(".container-fluid").delegate("input","keyup",function(){
        refreshChart();
    })
    downloadBtn.click(function(){
        downloadPng(this);
    });
    dynamicDataGroup.delegate(".delete-btn","click",function(){
        $(this).closest(".dynamic-data-item").remove();
        refreshDynamicDataGroup();
        refreshChart();
    });
    addBtn.click(function(){
        var index = $(".dynamic-data-group .data-value").length + 1;
        //创建元素
        var dynamicDataItem = "<div class=\"dynamic-data-item\">"
            + "<label for=\"\" class=\"col-sm-1 control-label\">" + index + "</label>"
            + "<div class=\"col-sm-5\">"
            + "<input type=\"text\" class=\"form-control data-value\" value=\"\" placeholder=\"数据值\">"
            + "</div>"
            + "<div class=\"col-sm-5\">"
            + "<input type=\"text\" class=\"form-control data-name\" value=\"\" placeholder=\"数据名\">"
            + "</div>"
            + "<div class=\"col-sm-1\">"
            + "<button class=\"btn btn-xs btn-danger delete-btn\" type=\"buttton\" title=\"删除该条数据\">删除</button>"
            + "</div>"
            + "</div>";

        dynamicDataGroup.append(dynamicDataItem);
    });
});

$(window).resize(function(){
    refreshChart();
});

/**
 * 刷新图表
 */
function refreshChart() {

    canvasContainer.css('height', canvasContainer.css('width'));
    myChart = echarts.init(canvasContainer.get(0));

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
    legend.data = packageLegendData();

    serie_pie.type = 'pie';
    serie_pie.radius = $("#series-radius").val() * 100 + "%";
    packageSerieData(serie_pie);

    series[0] = serie_pie;

    _option.title = title;
    _option.legend = legend;
    _option.series = series;
    console.log(document.getElementById('forbiddenBgColor').checked);
    console.log(!document.getElementById('forbiddenBgColor').checked);
    if(!document.getElementById('forbiddenBgColor').checked)
        _option.backgroundColor = $("#backgroundColor").val();

    myChart.setOption(_option);
}

function packageLegendData() {
    var legendData = [];
    dataNames = $(".dynamic-data-group .data-name");

    for (var i = 0; i < dataNames.length; i++) {
        legendData[i] = dataNames[i].value;
    }
    return legendData;
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

function refreshDynamicDataGroup() {
    dataItem = $(".dynamic-data-group .dynamic-data-item");
    for(var i = 0; i < dataItem.length; i++){
        $(dataItem.get(i)).find('label').text(i + 1);
    }
}

function downloadPng(aLink) {
    var canvas = document.getElementsByTagName("canvas");
    aLink.download = "chart-pie";
    aLink.href = canvas[0].toDataURL("image/png");
}