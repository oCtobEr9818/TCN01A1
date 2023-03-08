import { useState } from "react";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { papaparseData } from "../components/papa_parse";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";
import { twoDecimal } from "../components/two_decimal";

export const ReadCSV = () => {
  // 溫度
  const [tmpData, setTmpData] = useState([]);
  const [tmpFileName, setTmpFileName] = useState("");

  // 濕度
  const [humDatas, setHumDatas] = useState([]);
  const [humFileName, setHumFileName] = useState("");

  const onChangeTmpInput = (e) => setTmpFileName(e.target.value);
  const handleTmpData = () => papaparseData(setTmpData, tmpFileName.slice(12));

  const onChangeHumInput = (e) => setHumFileName(e.target.value);
  const handleHumData = () => papaparseData(setHumDatas, humFileName.slice(12));

  // 讀取 .csv 檔案內容
  const scale = 0.1;
  let indoorTmp_A1 = [];
  let indoorTmp_A2 = [];
  let indoorTmp_B1 = [];
  let indoorTmp_B2 = [];
  let outdoorTmp = [];

  // 移除不需要資料項目
  const filteredCsv = tmpData.filter((item) => {
    return item[0].slice(6, 10) === "2023";
  });

  filteredCsv.forEach((item) => {
    indoorTmp_A1.push({
      y: twoDecimal(item[1]) * scale,
      label: item[0],
    });
    indoorTmp_A2.push({
      y: twoDecimal(item[2]) * scale,
      label: item[0],
    });
    indoorTmp_B1.push({
      y: twoDecimal(item[3]) * scale,
      label: item[0],
    });
    indoorTmp_B2.push({
      y: twoDecimal(item[4]) * scale,
      label: item[0],
    });
    outdoorTmp.push({
      y: twoDecimal(item[5]) * scale,
      label: item[0],
    });
  });

  //
  //
  //

  function getHumDataIndex(e) {
    const targetColumns = ["0x221e", "0x221f", "0x2220", "0x2221", "0x2225"];
    const indexHum = humDatas[0]?.reduce((acc, curr, index) => {
      if (targetColumns.includes(curr)) {
        acc.push(index);
      }

      return acc;
    }, []);

    return indexHum[e];
  }

  const humData = humDatas.filter((item) => item[0].slice(6, 10) === "2023");

  const datas1 = humData.map((item) => ({
    y: Number(item[getHumDataIndex(0)]) * scale,
    label: item[0],
  }));
  const datas2 = humData.map((item) => ({
    y: Number(item[getHumDataIndex(1)]) * scale,
    label: item[0],
  }));
  const datas3 = humData.map((item) => ({
    y: Number(item[getHumDataIndex(2)]) * scale,
    label: item[0],
  }));
  const datas4 = humData.map((item) => ({
    y: Number(item[getHumDataIndex(3)]) * scale,
    label: item[0],
  }));
  const datas5 = humData.map((item) => ({
    y: Number(item[getHumDataIndex(4)]) * scale,
    label: item[0],
  }));

  // CanvasJS chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options_tmp = {
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
        dataPoints: indoorTmp_A1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內A2溫度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: indoorTmp_A2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B1溫度",
        color: "#007500",
        showInLegend: true,
        dataPoints: indoorTmp_B1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B2溫度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: indoorTmp_B2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室外溫度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: outdoorTmp,
      },
    ],
  };

  const options_hum = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "室內外濕度折線圖",
      fontSize: 30,
    },
    axisY: {
      title: "(%)",
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
        toolTipContent: "Time：{label}<br />{name}：{y} %",
        name: "室內A1濕度",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: datas1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內A2濕度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: datas2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B1濕度",
        color: "#007500",
        showInLegend: true,
        dataPoints: datas3,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B2濕度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: datas4,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室外濕度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: datas5,
      },
    ],
  };

  return (
    <div className="read_csv">
      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChangeTmpInput} />
          <button onClick={handleTmpData}>讀取</button>
        </div>
      </div>

      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChangeHumInput} />
          <button onClick={handleHumData}>讀取</button>
        </div>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options_tmp} />
      </div>
      <div className="chart-wrap">
        <CanvasJSChart options={options_hum} />
      </div>
    </div>
  );
};
