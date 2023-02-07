const avgSOC = (fn) => {
  let arr = fn;
  let sum_0100 = 0;
  let count_0100 = 0;

  arr.forEach((item, index) => {
    if (index <= 3583) {
      sum_0100 += item.y;
      count_0100++;
    }
    if (index >= 3584 && index <= 7168) {
      // console.log(item);
    }
    if (index >= 7169 && index <= 10753) {
      // console.log(item);
    }
    if (index >= 10754 && index <= 14337) {
      // console.log(item);
    }
    if (index >= 14338 && index <= 17922) {
      // console.log(item);
    }
    if (index >= 17923 && index <= 21507) {
      // console.log(item);
    }
    if (index >= 21508 && index <= 25091) {
      // console.log(item);
    }
    if (index >= 25092 && index <= 28676) {
      // console.log(item);
    }
    if (index >= 28677 && index <= 32261) {
      // console.log(item);
    }
    if (index >= 32262 && index <= 32261) {
      // console.log(item);
    }
  });
  const res = Math.round(sum_0100 * 100) / 100 / count_0100;

  console.log(res);
};
