/*
    用于存放各种对数组操作的函数
*/

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
  if (x.hasOwnProperty('start_date')) {
    dateX = new Date(x.start_date);
  }

  if (y.hasOwnProperty('start_date')) {
    dateY = new Date(y.start_date);
  }

  return dateX && dateY ? dateX - dateY : 0;
}

module.exports = {
  getEventYears: getEventYears,
  yearSort: yearSort,
  dateSort: dateSort
};
