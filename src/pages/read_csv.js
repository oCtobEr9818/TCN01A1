import { useState, useMemo } from "react";

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
  // ******************************************************************************
  // 系統狀態方波圖
  const stepLine_chart = () => {
    let arrStepLine = [];
    let storage = [];
    let results = [];

    parseCsv.forEach((data) => {
      arrStepLine.push([data[0], data[5]]);
    });

    // 移除不需要資料項目
    arrStepLine.shift();
    arrStepLine.pop();
    arrStepLine.forEach((item, index) => {
      if (item[0].slice(0, 10) !== "01/10/2023") {
        arrStepLine.splice(index, 1);
      }
    });

    // 比對array前後值是否相同
    let prevValue = [null, null]; // [time, state]

    arrStepLine.forEach((currentValue) => {
      if (prevValue[1] !== null && prevValue[1] !== currentValue[1]) {
        storage.push(
          {
            label: prevValue[0],
            y: Number(prevValue[1]),
          },
          {
            label: currentValue[0],
            y: Number(currentValue[1]),
          }
        );
      }
      prevValue = currentValue;
    });

    // 將資料繪製成方波
    storage.forEach((data, index) => {
      if (index % 2 !== 0) {
        results.push({
          ...data,
          x: index - 1,
        });
      } else {
        results.push(data);
      }
    });

    return results;
  };

  // ******************************************************************************

  const HOUR_COUNT = 18;
  const BASE_DATE = "2023/01/10";
  const CHART_DATA = getChartData();
  const ENTRIES_CHART_DATA = Object.entries(CHART_DATA); // For最大、最小、平均SOC使用

  // 計算最大或最小SOC
  const getMaxOrMinSOC = (arr, isMax = true) => {
    let results = [];

    for (let i = 0; i < HOUR_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString();
      const items = arr.filter((item) => item.label.slice(12, 14) === hour);
      const hourMaxOrMin =
        items.length !== 0
          ? (isMax ? Math.max : Math.min)(
              ...items.map((e) => (e.y === 102.3 ? 0 : e.y))
            )
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
  const handleAvgSOC = useMemo(() => {
    let avgProcess = Array(HOUR_COUNT).fill(0);
    let results = [];

    for (let i = 0; i < HOUR_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString();
      const items = CHART_DATA.filter(
        (item) => item.label.slice(12, 14) === hour
      );
      items.forEach((data) => {
        const judge_data = data.y === 102.3 ? 0 : data.y;
        avgProcess[i] += judge_data / items.length;
      });
    }

    const Process = avgProcess.map((data) => Math.round(data * 100) / 100);

    Process.forEach((item, index) => {
      results.push({
        y: item,
        label: `${BASE_DATE}, ${index < 10 ? "0" + index : index}:00`,
      });
    });

    return results;
  }, [CHART_DATA]);

  // 取得最大SOC值
  const getMaxSOC = () => {
    let arrMaxSOC = [];

    ENTRIES_CHART_DATA.forEach((item) => {
      arrMaxSOC.push(
        Math.round((item[1].y === 102.3 ? 0 : item[1].y) * 100) / 100
      );
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
      if (item[1].y !== (undefined || null)) {
        sum += item[1].y === 102.3 ? 0 : item[1].y;
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
      viewportMinimum: -20,
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
        name: "最大SOC",
        showInLegend: true,
        dataPoints: handleMaxSOC(),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "平均SOC",
        showInLegend: true,
        dataPoints: handleAvgSOC,
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "最小SOC",
        showInLegend: true,
        dataPoints: handleMinSOC(),
      },
    ],
  };

  const options_stepline = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "系統狀態",
      fontSize: 30,
    },
    axisY: {
      title: "",
      viewportMinimum: -2,
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
        type: "stepLine",
        axisYIndex: 1,
        toolTipContent: "{label}</br >{name}：{y}",
        name: "State",
        showInLegend: true,
        dataPoints: stepLine_chart(),
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
        <CanvasJSChart options={options_stepline} />
      </div>
    </div>
  );
};
