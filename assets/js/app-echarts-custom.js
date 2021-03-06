/**
 * Created by WaTer on 2016/6/8.
 */

var canvasContainer = $("#main"),
    optionsContainer = $("#options-panel");
var myChart;
var option = {};
var option_component_select = $("select"),
    option_component_input = $("input"),
    option_component_checkbox = $("input[type=checkbox]"),
    option_component_colorPicker = $("input[type=color]");
    option_component_range = $("#series-radius");
var dataNames = $(".dynamic-data-group .data-name"),
    dataValues = $(".dynamic-data-group .data-value"),
    dataItem = $(".dynamic-data-group .dynamic-data-item"),
    dynamicDataGroup = $(".dynamic-data-group");
var addBtn = $("#add-btn"),
    deleteBtns = $(".delete-btn");

$(function(){

    refreshChart();

    option_component_select.change(function(){
        refreshChart();
    });
    option_component_checkbox.change(function () {
        refreshChart();
    });
    option_component_colorPicker.change(function(){
        refreshChart();
    });
    option_component_range.on("change",null,null,function(){
        refreshChart();
    });
    option_component_input.change(function(){
        refreshChart();
    });
    $(".container-fluid").delegate("input","keyup",function(){
        refreshChart();
    });
    dynamicDataGroup.delegate(".delete-btn","click",function(){
        $(this).closest(".dynamic-data-item").remove();
        refreshDynamicDataGroup();
        refreshChart();
    });
    addBtn.click(function(){
        var index = $(".dynamic-data-group .data-value").length + 1;
        //创建元素
        var dynamicDataItem = "<div class=\"dynamic-data-item clearfix\">"
            + "<label for=\"\" class=\"col-sm-1 control-label\">" + index + "</label>"
            + "<div class=\"col-sm-4\">"
            + "<input type=\"text\" class=\"form-control data-value\" value=\"\" placeholder=\"数据值\">"
            + "</div>"
            + "<div class=\"col-sm-5\">"
            + "<input type=\"text\" class=\"form-control data-name\" value=\"\" placeholder=\"数据名\">"
            + "</div>"
            + "<div class=\"col-sm-2\">"
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
    canvasContainer.css('height', $(window).height() - 52 - 20);
    optionsContainer.css('height', $(window).height() - 52);
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
    _option.toolbox = {
        feature: {
            saveAsImage: {
                show: true,
                title: '保存为png图片',
                backgroundColor: 'transparent'
            },
            dataView: {
                show: true,
                title: '数据视图',
            }
        },
        bottom: 0
    }

    //设置全局参数
    if(!document.getElementById('forbiddenBgColor').checked)
        _option.backgroundColor = $("#global-backgroundColor").val();

    _option.color = getGlobalColors();

    _option.textStyle = {
        color: $("#global-textStyle-color").val(),
        fontStyle: $("#global-textStyle-fontStyle").val(),
        fontWeight: $("#global-textStyle-fontWeight").val(),
        fontFamily: $("#global-textStyle-fontFamily").val(),
        fontSize: $("#global-textStyle-fontSize").val()
    }


    _option.animation = document.getElementById("global-animation").checked;
    if(_option.animation){
        _option.animationDuration = $("#global-animationDuration").val();
        _option.animationDelay = function(index){
            return index * parseInt($("#global-animationDelay").val());
        }
        _option.animationEasing = $("#global-animationEasing").val();
        _option.animationDurationUpdate = $("#global-animationDurationUpdate").val();
        _option.animationDelayUpdate = $("#global-animationDelayUpdate").val();
        _option.animationEasingUpdate = function(index){
            return index * parseInt($("#global-animationEasingUpdate").val());
        }
    }

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

function getGlobalColors() {
    var colors = [],
        _globalColors = $(".global-color");

    for(var i = 0; i < _globalColors.length; i++) {
        colors[i] = _globalColors[i].value;
    }

    return colors;
}