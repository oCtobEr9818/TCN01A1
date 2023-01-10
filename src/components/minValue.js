export const minValue = (arr) => {
  let res = [];
  arr.forEach((element) => res.push(element.y));
  return Math.min(...res);
};
