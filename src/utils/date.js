const getCurrentDate = () => {
  const nowDate = new Date();
  const date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
  };
  const newmonth = date.month > 9 ? date.month : "0" + date.month;
  const day = date.date > 9 ? date.date : "0" + date.date;
  const updateTime = date.year + "年" + newmonth + "月" + day + "日";
  return updateTime;
};

const getCurrentTime = () => {
  const date = new Date();
  const seperator1 = "-";
  const seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  const currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
};
// 获取上个月的年月
const getLastMonthDate = () => {
  let date = new Date();
  let months = date.getMonth() + 1;
  let m = "0" + (months - 1);
  let y = date.getFullYear();
  if (months == 1) {
    y--;
    m = "12";
  }
  return y + "-" + m.substring(m.length - 2);
};

// 获取几年后的今天
const getRelativeYearTime = (num) => {
  const currentTime = getCurrentTime();
  const curYear = currentTime.split("-")[0] - 0;
  const relativeYear = curYear + num;
  return relativeYear + currentTime.slice(4);
};

//时间转换  2022-06-29T10:45:18.000+08:00 =>'2022-06-29 10:45:18'
function formatDate(date) {
  if (!date) return "";
  date = new Date(date);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var m1 = date.getMinutes();
  var s = date.getSeconds();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
}

/**
 * 获取本周的第一天
 * 返回格式: YYYY-mm-dd
 *
 */
function getCurrentWeekFirstDay(date) {
  const time = new Date(date);
  var days = time.getDay();
  days = days == 0 ? 7 : days;

  let weekFirstDay = new Date(time - (days - 1) * 86400000);
  //console.log('===', weekFirstDay);
  let firstMonth = Number(weekFirstDay.getMonth()) + 1;
  if (firstMonth < 10) {
    firstMonth = "0" + firstMonth;
  }
  let weekFirstDays = weekFirstDay.getDate();
  if (weekFirstDays < 10) {
    weekFirstDays = "0" + weekFirstDays;
  }
  return weekFirstDay.getFullYear() + "-" + firstMonth + "-" + weekFirstDays;
}

/**
 * 获取本周的最后一天
 * 返回格式: YYYY-mm-dd
 *
 */
function getCurrentWeekLastDay(date) {
  const time = new Date(date);
  var days = time.getDay();
  days = days == 0 ? 7 : days;

  let weekFirstDay = new Date(time - (days - 1) * 86400000);
  let weekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000);
  let lastMonth = Number(weekLastDay.getMonth()) + 1;
  if (lastMonth < 10) {
    lastMonth = "0" + lastMonth;
  }
  let weekLastDays = weekLastDay.getDate();
  if (weekLastDays < 10) {
    weekLastDays = "0" + weekLastDays;
  }
  return weekLastDay.getFullYear() + "-" + lastMonth + "-" + weekLastDays;
}

export {
  getCurrentDate,
  getCurrentTime,
  getLastMonthDate,
  getRelativeYearTime,
  formatDate,
  getCurrentWeekFirstDay,
  getCurrentWeekLastDay,
};
