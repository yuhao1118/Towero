// 输入存放event_key的数组，输出去重后参赛年份
// eventKeyArray -- event_key数组，event_key格式: 2019xxxx
// res           -- 去重后的参赛年份数组
function getEventYears(eventKeyArray) {
  var eventYears = []; //存放未去重的年份数组
  for (var i in eventKeyArray) {
    var yearStr = eventKeyArray[i].slice(0, 4);
    var yearNum = parseInt(yearStr);
    eventYears.push(yearNum); // 截取前4位年份，添加到eventsYears
  }
  return uniqueArray(eventYears).sort(yearSort);
}

// 数组去重函数
// arr          -- 要去重的数组
function uniqueArray(arr) {
  // 存放最终结果
  var res = [];
  for (var i in arr) {
    // 遍历数组元素
    if (res.indexOf(arr[i]) == -1 && arr[i] != null) {
      // 如果结果数组不存在该元素则保存
      res.push(arr[i]);
    }
  }

  return res;
}

// 年份从大到小排序函数
function yearSort(x, y) {
  return y - x;
}

// 比赛日期从小到大排序
function dateSort(x, y) {
  var dateX;
  var dateY;

  // 创建js日期对象
  if (x.hasOwnProperty('start_date')) {
    dateX = new Date(x.start_date);
  }

  if (y.hasOwnProperty('start_date')) {
    dateY = new Date(y.start_date);
  }

  return dateX && dateY ? dateX - dateY : 0;
}

// 按队号从小到大排序
function teamSort(x,y){
    return x.team_number - y.team_number;
}

// 按队号从小到大排序
function oprSort(x,y){
    return y.oprs - x.oprs;
}

// 日期替换器，将eventInfo里的起始日期的属性替换成英文简写
function dateReplace(dateStr) {
  var date = new Date(dateStr);
  var tempArr = date.toDateString().split(' ');
  var res = tempArr[1] + ' ' + tempArr[2]; // 只返回日月即可，年份由另外的属性获取
  return res;
}

module.exports = {
  getEventYears: getEventYears,
  yearSort: yearSort,
  dateSort: dateSort,
  dateReplace: dateReplace,
  teamSort: teamSort,
  oprSort: oprSort
};
