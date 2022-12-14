import { useState, useEffect } from "react";
import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { Gauge } from "../components/gauge";
import { FetchApi } from "../components/fetchApi";

export const InstantAnalysis = () => {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    setDatas(FetchApi());
  }, []);

  // 顯示or隱藏圖表線段
  const onChangeAvgVoltage = (e) => {
    if (e.dataSeries.visible === undefined || e.dataSeries.visible) {
      e.dataSeries.visible = false;
      e.dataSeries.toolTipContent = null;
    } else {
      e.dataSeries.visible = true;
      e.dataSeries.toolTipContent = "{name}：{y}";
    }
    e.chart.render();
  };

  // Canvas chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options_voltage = {
    // 電壓折線圖
    theme: "light2",
    animationEnabled: true, // 初始動畫
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "電壓分布圖",
      fontSize: 30,
    },
    axisY: {
      title: "電壓(V)",
    },
    legend: {
      fontFamily: "Arial",
      cursor: "pointer",
      horizontalAlign: "center",
      itemclick: onChangeAvgVoltage,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        name: "test",
        showInLegend: true,
        dataPoints: [
          { y: 158, label: "Jan" },
          { y: 153, label: "Feb" },
          { y: 156, label: "Mar" },
          { y: 123, label: "Apr" },
          { y: 142, label: "May" },
          { y: 185, label: "Jun" },
          { y: 146, label: "Jul" },
          { y: 146, label: "Aug" },
          { y: 150, label: "Sep" },
          { y: 107, label: "Oct" },
          { y: 181, label: "Nov" },
          { y: 150, label: "Dec" },
        ],
      },
    ],
  };

  const options_current = {
    // 電流折線圖
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    exportEnabled: true,
    title: {
      text: "電流分布圖",
      fontSize: 30,
    },
    axisY: {
      title: "電流(A)",
    },
    legend: {
      fontFamily: "Arial",
      cursor: "pointer",
      horizontalAlign: "center",
      itemclick: onChangeAvgVoltage,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        // name: "23",
        showInLegend: true,
        dataPoints: [
          { y: 155, label: "Jan" },
          { y: 150, label: "Feb" },
          { y: 152, label: "Mar" },
          { y: 148, label: "Apr" },
          { y: 142, label: "May" },
          { y: 150, label: "Jun" },
          { y: 146, label: "Jul" },
          { y: 149, label: "Aug" },
          { y: 153, label: "Sep" },
          { y: 158, label: "Oct" },
          { y: 154, label: "Nov" },
          { y: 150, label: "Dec" },
        ],
      },
    ],
  };

  return (
    <div className="chart">
      <div className="chart-wrap">
        <CanvasJSChart options={options_voltage} />
        <CanvasJSChart options={options_current} />
        <Gauge soc="70" />
      </div>
    </div>
  );
};
