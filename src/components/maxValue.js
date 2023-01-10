export const maxValue = (arr) => {
  let res = [];
  arr.forEach((element) => res.push(element.y));
  return Math.max(...res);
};
