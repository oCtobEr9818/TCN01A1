import { useState, useCallback } from "react";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { papaparseData } from "../components/papa_parse";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";
import { twoDecimal } from "../components/two_decimal";

export const ReadCSV = () => {
  const [tempData, setTempData] = useState([]);
  const [tempFileName, setTempFileName] = useState("");

  const [humDatas, setHumDatas] = useState([]);
  const [humFileName, setHumFileName] = useState("");

  const onChangetempInput = (e) => setTempFileName(e.target.value);
  const handletempData = () =>
    papaparseData(setTempData, tempFileName.slice(12));

  const onChangeHumInput = (e) => setHumFileName(e.target.value);
  const handleHumData = () => papaparseData(setHumDatas, humFileName.slice(12));

  const scale = 0.1;

  // 處理溫度資料
  const processTempData = useCallback((data) => {
    let indoortemp_A1 = [];
    let indoortemp_A2 = [];
    let indoortemp_B1 = [];
    let indoortemp_B2 = [];
    let outdoortemp = [];

    // 移除不需要資料項目
    const filteredCsv = data.filter((item) => item[0].slice(6, 10) === "2023");

    // 資料push到Array
    filteredCsv.forEach((item) => {
      indoortemp_A1.push({
        y: twoDecimal(item[1]) * scale,
        label: item[0],
      });
      indoortemp_A2.push({
        y: twoDecimal(item[2]) * scale,
        label: item[0],
      });
      indoortemp_B1.push({
        y: twoDecimal(item[3]) * scale,
        label: item[0],
      });
      indoortemp_B2.push({
        y: twoDecimal(item[4]) * scale,
        label: item[0],
      });
      outdoortemp.push({
        y: twoDecimal(item[5]) * scale,
        label: item[0],
      });
    });

    return {
      indoortemp_A1,
      indoortemp_A2,
      indoortemp_B1,
      indoortemp_B2,
      outdoortemp,
    };
  }, []);

  // 室內外濕度資料
  function processHumData(e) {
    const datas = [[], [], [], [], []];

    // 獲取需要資料的index
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

    // 移除不需要資料項目
    const humData = humDatas.filter((item) => item[0].slice(6, 10) === "2023");

    // 將資料轉換成canvas.js圖表用格式
    for (let i = 0; i < humData.length; i++) {
      for (let j = 0; j < datas.length; j++) {
        datas[j].push({
          y: Number(humData[i][getHumDataIndex(j)]),
          label: humData[i][0],
        });
      }
    }

    return datas[e];
  }

  // CanvasJS chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options_temp = {
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
        dataPoints: processTempData(tempData).indoortemp_A1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內A2溫度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: processTempData(tempData).indoortemp_A2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B1溫度",
        color: "#007500",
        showInLegend: true,
        dataPoints: processTempData(tempData).indoortemp_B1,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B2溫度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: processTempData(tempData).indoortemp_B2,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室外溫度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: processTempData(tempData).outdoortemp,
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
        dataPoints: processHumData(0),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內A2濕度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: processHumData(1),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B1濕度",
        color: "#007500",
        showInLegend: true,
        dataPoints: processHumData(2),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B2濕度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: processHumData(3),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室外濕度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: processHumData(4),
      },
    ],
  };

  return (
    <div className="read_csv">
      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChangetempInput} />
          <button onClick={handletempData}>讀取</button>
        </div>
      </div>

      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChangeHumInput} />
          <button onClick={handleHumData}>讀取</button>
        </div>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options_temp} />
      </div>
      <div className="chart-wrap">
        <CanvasJSChart options={options_hum} />
      </div>
    </div>
  );
};
