import { useState } from "react";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { papaparseData } from "../components/papa_parse";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";

export const ReadCSV = () => {
  const [parseCsv, setParseCsv] = useState([]);
  const [fileName, setFileName] = useState("");

  const onChange_FileName = (e) => setFileName(e.target.value);

  const handleCsvData = () => papaparseData(setParseCsv, fileName.slice(12));

  // 讀取 .csv 檔案內容
  let indoor_A1 = [];
  let indoor_A2 = [];
  let indoor_B1 = [];
  let indoor_B2 = [];
  let outdoor = [];

  // 移除不需要資料項目
  parseCsv.forEach((item, index) => {
    if (item[0].slice(6, 10) !== "2023") {
      parseCsv.splice(index, 1);
    }
  });

  parseCsv.forEach((item) => {
    indoor_A1.push({
      y: Math.round(Number(item[1]) * 0.1 * 100) / 100,
      label: item[0],
    });
    indoor_A2.push({
      y: Math.round(Number(item[2]) * 0.1 * 100) / 100,
      label: item[0],
    });
    indoor_B1.push({
      y: Math.round(Number(item[3]) * 0.1 * 100) / 100,
      label: item[0],
    });
    indoor_B2.push({
      y: Math.round(Number(item[4]) * 0.1 * 100) / 100,
      label: item[0],
    });
    outdoor.push({
      y: Math.round(Number(item[5]) * 0.1 * 100) / 100,
      label: item[0],
    });
  });

  // CanvasJS chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "室內外溫度折線圖",
      fontSize: 30,
    },
    axisY: {
      title: "(℃)",
    },
    legend: {
      fontFamily: "Arial",
      cursor: "pointer",
      horizontalAlign: "center",
      itemclick: lineDisplay,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "Time：{label}<br />{name}：{y} ℃",
        name: "室內A1溫度",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: indoor_A1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內A2溫度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: indoor_A2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B1溫度",
        color: "#007500",
        showInLegend: true,
        dataPoints: indoor_B1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B2溫度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: indoor_B2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室外溫度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: outdoor,
      },
    ],
  };

  return (
    <div className="read_csv">
      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChange_FileName} />
          <button onClick={handleCsvData}>讀取</button>
        </div>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
};
