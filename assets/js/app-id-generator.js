var $province = $("#province"),
	$city = $("#city"),
	$county = $("#county"),
	$year = $("#year"),
	$month = $("#month"),
	$day = $("#day"),
	$exeBtn = $("#exeBtn"),
	$idNos = $("#idNos"),
	$timePoints = $("input[name=timePoint]");
	
var sexRandomNum = {"male":[1, 3, 5, 7, 9], "female":[0, 2, 4, 6, 8]}; // 用于生成身份证倒数第二位
$(function() {

	// 绑定事件
	$province.change(updateCity);
	$city.change(updateCounty);
	$month.change(updateDay);
	$exeBtn.click(refreshIds);
	$timePoints.click(changeTimePoint);
		
	// 初始化省市区
	for(var i in provincesJson) {
		$province.append('<option value="' + provincesJson[i].code + '">' + provincesJson[i].name + '</option>');
	}
	$province.change();
	
	// 初始化年月日
	var currentYear = new Date().getFullYear();
	for(var i = 0; i < 100; i++) {
		$year.append('<option value="' + (currentYear - i) + '">' + (currentYear - i) + '年</option>');
	}
	$("#todayBtn").click();
	
	// 生成默认身份证
	$exeBtn.click();
})

function changeTimePoint(e) {
	var timePointsValue = e.target.value,
		unit = timePointsValue.split('-')[0],
		number = timePointsValue.split('-')[1],
		currentDate = new Date(),
		newDate;
		
	switch(unit) {
		case 'day':
			newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - number);
			break;
		case 'month':
			newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - number, currentDate.getDate());
			break;
		case 'year':
			newDate = new Date(currentDate.getFullYear() - number, currentDate.getMonth(), currentDate.getDate());
			break;
		default:
			return;
	}
	var year = newDate.getFullYear(),
		month = newDate.getMonth() + 1,
		day = newDate.getDate();
	$("#year").val(year);
	$("#month").val(month < 10 ? '0' + month : month);
	$("#day").val(day < 10 ? '0' + day : day);
}

function refreshIds() {
	var id = generateId();
	$idNos.text(id);
}

function generateId() {
	var genders = document.getElementsByName("gender");
	var genderValue;
	
	for( var i in genders) {
		if(genders[i].checked) {
			genderValue = genders[i].value;
			break;
		}
	}
	
	var idStr,
		province = $province.val(),
		city = $city.val(),
		county = $county.val(),
		year = $year.val(),
		month = $month.val(),
		day = $day.val(),
		random = Math.floor(Math.random() * 100),
		gender = sexRandomNum[genderValue][Math.floor(Math.random() * 4)],
	
	
	idStr = province + city + county + year + month + day + (random < 10 ? '0' + random : random) + gender;
	
	return idStr + generateCheckNumber(idStr);
}

function generateCheckNumber(array) {
	var stard = "10X98765432", //最后一位身份证的号码
		first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
	var sum = 0;
	for (var i = 0; i < 17; i++){
		sum += array[i] * first[i];
	}
	return stard[sum % 11];
}

function updateCity() {
	var provinceCode = $province.val();
	$city.empty();
	
	for(var i in provincesJson) {
		if(provincesJson[i].code == provinceCode) {
			for(var j in provincesJson[i].cities) {
				$city.append('<option value="' + provincesJson[i].cities[j].code + '">' + provincesJson[i].cities[j].name + '</option>');
				if(j == 0) {
					$county.empty();
					for(var k in provincesJson[i].cities[j].counties) {
						$county.append('<option value="' + provincesJson[i].cities[j].counties[k].code + '">' + provincesJson[i].cities[j].counties[k].name + '</option>');
					}
				}
			}
			break;	
		}
	}
	
	$city.change();
}

function updateCounty() {
	var provinceCode = $province.val(),
		cityCode = $city.val();
	$county.empty();
	
	for(var i in provincesJson) {
		if(provincesJson[i].code == provinceCode) {
			for(var j in provincesJson[i].cities) {
				if(provincesJson[i].cities[j].code == cityCode) {
					for(var k in provincesJson[i].cities[j].counties) {
						$county.append('<option value="' + provincesJson[i].cities[j].counties[k].code + '">' + provincesJson[i].cities[j].counties[k].name + '</option>');
					}
				}
			}
		}
	}
}

function updateDay() {
	// TODO 根据月份更新选择的天数
}
		