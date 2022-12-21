export const formatDate = (date) => {
  let d = new Date(date);
  let second = d.getSeconds().toString();
  let minute = d.getMinutes().toString();
  let hour = d.getHours().toString();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear();

  if (second.length < 2) {
    second = "0" + second;
  }
  if (minute.length < 2) {
    minute = "0" + minute;
  }
  if (hour.length < 2) {
    hour = "0" + hour;
  }
  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("-") + " " + [hour, minute, second].join(":");
};
