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
  // 存放最终结果
  var res = [];
  for (var i in eventYears) {
    // 遍历数组元素
    if (res.indexOf(eventYears[i]) == -1 && eventYears[i] != null) {
      // 如果结果数组不存在该元素则保存
      res.push(eventYears[i]);
    }
  }
  // 返回去重后的数组
  return res.sort(yearSort);
}

// 年份从大到小排序函数
function yearSort(x, y) {
  return y - x;
}

module.exports = {
  getEventYears: getEventYears,
  yearSort: yearSort
};
