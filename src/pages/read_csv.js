import { useState } from "react";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { papaparseData } from "../components/papa_parse";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";

export const ReadCSV = () => {
  const [parseCsv, setParseCsv] = useState([]);
  const [fileName, setFileName] = useState("");

  const onChangeInput = (e) => {
    setFileName(e.target.value);
  };

  const handleParseCsv = () => {
    papaparseData(setParseCsv, fileName.slice(12));
  };

  // 讀取csv檔案內容
  const getChartData = () => {
    let arrSOC = [];

    parseCsv.forEach((item) => {
      arrSOC.push({
        y: Math.round(Number(item[8]) * 0.1 * 100) / 100,
        label: item[0],
      });
    });
    arrSOC.shift();
    arrSOC.pop();

    const deleteItem = arrSOC.findIndex((e) => e.y === 2000);
    arrSOC.splice(deleteItem, 1);

    return arrSOC;
  };

  const HOUR_COUNT = 18;
  const BASE_DATE = "2023/01/10";
  const CHART_DATA = getChartData();
  const ENTRIES_CHART_DATA = Object.entries(CHART_DATA);
  // 計算最大或最小SOC
  const getMaxOrMinSOC = (arr, isMax = true) => {
    let results = [];

    for (let i = 0; i < HOUR_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString();
      const items = arr.filter((item) => item.label.slice(12, 14) === hour);
      const hourMaxOrMin =
        items.length !== 0
          ? (isMax ? Math.max : Math.min)(...items.map((e) => e.y))
          : 0;
      results.push({ y: hourMaxOrMin, label: `${BASE_DATE}, ${hour}:00` });
    }

    return results;
  };
  // 折線圖-最大SOC
  const handleMaxSOC = () => {
    return getMaxOrMinSOC(CHART_DATA);
  };
  // 折線圖-最小SOC
  const handleMinSOC = () => {
    return getMaxOrMinSOC(CHART_DATA, false);
  };
  // 折線圖-平均SOC
  const handleAvgSOC = () => {
    let avgProcess = Array(HOUR_COUNT).fill(0);
    let results = [];

    for (let i = 0; i < HOUR_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString();
      const items = CHART_DATA.filter(
        (item) => item.label.slice(12, 14) === hour
      );
      items.forEach((data) => (avgProcess[i] += data.y / items.length));
    }

    const Process = avgProcess.map((data) => Math.round(data * 100) / 100);

    Process.forEach((item, index) => {
      results.push({
        y: item,
        label: `${BASE_DATE}, ${index < 10 ? "0" + index : index}:00`,
      });
    });

    return results;
  };

  // 取得最大SOC值
  const getMaxSOC = () => {
    let arrMaxSOC = [];

    ENTRIES_CHART_DATA.forEach((item) => {
      arrMaxSOC.push(Math.round(item[1].y * 100) / 100);
    });

    return Math.max(...arrMaxSOC);
  };
  // 取得最小SOC值
  const getMinSOC = () => {
    let arrMinSOC = [];

    ENTRIES_CHART_DATA.forEach((item) => {
      arrMinSOC.push(Math.round(item[1].y * 100) / 100);
    });

    return Math.min(...arrMinSOC);
  };
  // 取得平均SOC值
  const getAvgSOC = () => {
    let sum = 0;
    let count = 0;

    ENTRIES_CHART_DATA.forEach((item) => {
      if ((item[1].y !== undefined) | Number) {
        sum += Number(item[1].y);
        count++;
      }
    });

    const result = Math.round((sum / count) * 100) / 100;
    return result;
  };

  // CanvasJS chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "SOC",
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
        toolTipContent: "Time：{label}<br />{name}：{y} %",
        name: "最大SOC",
        showInLegend: true,
        dataPoints: handleMaxSOC(),
      },
      {
        type: "spline",
        toolTipContent: "{name}：{y} %",
        name: "平均SOC",
        showInLegend: true,
        dataPoints: handleAvgSOC(),
      },
      {
        type: "spline",
        toolTipContent: "{name}：{y} %",
        name: "最小SOC",
        showInLegend: true,
        dataPoints: handleMinSOC(),
      },
    ],
  };

  return (
    <div className="read_csv">
      <div className="button-wrap">
        <input type="file" accept=".csv" onChange={onChangeInput} />
        <button onClick={handleParseCsv}>讀取</button>
      </div>

      <div className="data-wrap">
        <ul>
          <li>最大SOC：{getMaxSOC()}%</li>
          <li>平均SOC：{getAvgSOC()}%</li>
          <li>最小SOC：{getMinSOC()}%</li>
        </ul>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
};
