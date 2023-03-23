// 顯示or隱藏圖表線段
export const lineDisplay = (e) => {
  if (e.dataSeries.visible === undefined || e.dataSeries.visible) {
    e.dataSeries.visible = false;
    e.dataSeries.toolTipContent = null;
  } else {
    e.dataSeries.visible = true;
    e.dataSeries.toolTipContent = "{name}：{y} ℃";
  }
  e.chart.render();
};
