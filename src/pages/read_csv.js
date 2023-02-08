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

    return arrSOC;
  };

  // 圖表-平均SOC
  const handleAvgSOC = () => {
    let arr = getChartData();
    let arrDatas = []; // 00~17點的資料
    let avgProcess = []; // 資料暫存區
    let results = []; // 平均後的資料

    for (let i = 0; i < 18; i++) {
      arrDatas[i] = arr.filter(
        (item) => item.label.slice(12, 14) === (i < 10 ? "0" + i : i.toString())
      );

      avgProcess.push(0);
    }

    for (let i = 0; i < 18; i++) {
      arrDatas[i].forEach((data) => {
        avgProcess[i] += data.y / arrDatas[i].length;
      });
    }

    const process = avgProcess.map((data) => Math.round(data * 100) / 100);

    process.forEach((item, index) => {
      results.push({
        y: item,
        label: `2023/01/10, ${index < 10 ? "0" + index : index}:00`,
      });
    });

    return results;
  };

  // 圖表-最大SOC
  const handleMaxSOC = () => {
    let arr = getChartData();
    let arrDatas = []; // 00~17點的資料
    let maxProcess = []; // 資料暫存區
    let results = [];

    for (let i = 0; i < 18; i++) {
      arrDatas[i] = arr.filter(
        (item) => item.label.slice(12, 14) === (i < 10 ? "0" + i : i.toString())
      );

      maxProcess.push([]);
    }

    for (let i = 0; i < 18; i++) {
      arrDatas[i].forEach((e) => {
        maxProcess[i].push(e.y);
      });
    }

    maxProcess.forEach((item, index) => {
      if (item.length !== 0) {
        results.push({
          y: Math.max(...item),
          label: `2023/01/10, ${index < 10 ? "0" + index : index}:00`,
        });
      } else {
        results.push({
          y: 0,
          label: `2023/01/10, ${index < 10 ? "0" + index : index}:00`,
        });
      }
    });

    return results;
  };

  // 圖表-最小SOC
  const handleMinSOC = () => {
    let arr = getChartData();
    let arrDatas = []; // 00~17點的資料
    let minProcess = []; // 資料暫存區
    let results = [];

    for (let i = 0; i < 18; i++) {
      arrDatas[i] = arr.filter(
        (item) => item.label.slice(12, 14) === (i < 10 ? "0" + i : i.toString())
      );

      minProcess.push([]);
    }

    for (let i = 0; i < 18; i++) {
      arrDatas[i].forEach((e) => {
        minProcess[i].push(e.y);
      });
    }

    minProcess.forEach((item, index) => {
      if (item.length !== 0) {
        results.push({
          y: Math.min(...item),
          label: `2023/01/10, ${index < 10 ? "0" + index : index}:00`,
        });
      } else {
        results.push({
          y: 0,
          label: `2023/01/10, ${index < 10 ? "0" + index : index}:00`,
        });
      }
    });

    return results;
  };

  // 取得最大SOC值
  const getMaxSOC = () => {
    let arrMaxSOC = [];

    parseCsv.forEach((item) => {
      arrMaxSOC.push(Math.round(item[8] * 0.1 * 100) / 100);
    });
    arrMaxSOC.pop();

    return Math.max(...arrMaxSOC);
  };
  // 取得最小SOC值
  const getMinSOC = () => {
    let arrMinSOC = [];

    parseCsv.forEach((item) => {
      arrMinSOC.push(Math.round(item[8] * 0.1 * 100) / 100);
    });
    arrMinSOC.pop();

    return Math.min(...arrMinSOC);
  };
  // 取得平均SOC值
  const getAvgSOC = () => {
    let sum = 0;
    let count = 0;

    parseCsv.forEach((item) => {
      if ((item[8] !== undefined) | Number) {
        sum += Number(item[8]);
        count++;
      }
    });

    sum -= Number("0x22"); // 扣掉Array[0]的"0x22"
    count--; // 扣掉Array[0]的"0x22"的index

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
        toolTipContent: "{name}：{y} %",
        name: "最大SOC",
        showInLegend: true,
        dataPoints: handleMaxSOC(),
      },
      {
        type: "spline",
        toolTipContent: "Time：{label}<br />{name}：{y} %",
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
          <li>最小SOC：{getMinSOC()}%</li>
          <li>平均SOC：{getAvgSOC()}%</li>
        </ul>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
};
