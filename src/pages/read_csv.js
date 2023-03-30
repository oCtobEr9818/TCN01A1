import { useState, useEffect } from "react";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { papaparseData } from "../components/papa_parse";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";
import { twoDecimal } from "../components/two_decimal";
import { formatDate } from "../components/formatDate";

export const ReadCSV = () => {
  const [chartData, setChartData] = useState([]);
  const [chartFileName, setChartFileName] = useState("");

  const [tempData, setTempData] = useState([]);
  const [humData, setHumData] = useState([]);

  const onChangetempInput = (e) => setChartFileName(e.target.value);
  const handletempData = () => {
    try {
      papaparseData(setChartData, chartFileName.slice(12));
    } catch (error) {
      if (error.name === "Timeout") {
        alert("讀取時間超時，請再試一次！");
      } else {
        console.log("錯誤資訊：", error);
      }
    }
  };

  const scale = 0.1;
  const HOURS_COUNT = 24;
  const tempColumns = ["0x221a", "0x221b", "0x221c", "0x221d", "0x2224"];
  const humColumns = ["0x221e", "0x221f", "0x2220", "0x2221", "0x2225"];

  // 監聽state change
  useEffect(() => {
    setTempData(caculateChartData(chartData, tempColumns));
    setHumData(caculateChartData(chartData, humColumns));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  // 獲取targetColumns的index
  function getChartDataIndex(e, targetColumns) {
    const __index = chartData[0]?.reduce((acc, curr, index) => {
      if (targetColumns.includes(curr)) {
        acc.push(index);
      }

      return acc;
    }, []);

    return __index[e];
  }

  // 計算濕度資料
  function caculateChartData(func, indexColumns) {
    const __chartDatas = []; // 創建濕度資料的Array
    for (let i = 0; i < 5; i++) {
      let innerArray = [];
      for (let j = 0; j < 24; j++) {
        innerArray.push(0);
      }
      __chartDatas.push(innerArray);
    }

    // 移除不需要資料項目
    const filterChartData = func.filter(
      (item) => item[0].slice(6, 10) === "2023"
    );

    // 將資料做平均計算
    for (let i = 0; i < HOURS_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString(); // 小時少於二位數補0
      let items = filterChartData.filter(
        (item) => item[0]?.slice(12, 14) === hour
      );

      for (let j = 0; j < __chartDatas.length; j++) {
        items.forEach((data) => {
          __chartDatas[j][i] +=
            (Number(data[getChartDataIndex(j, indexColumns)])
              ? Number(data[getChartDataIndex(j, indexColumns)])
              : 0) / items.length;
        });
      }
    }

    return __chartDatas;
  }

  // 將濕度資料轉換成canvas.js用的資料格式
  function GetChartData(index, func) {
    const data = func;
    const dates_times = chartData[1]?.[0]?.slice(0, 10)
      ? chartData[1]?.[0]?.slice(0, 10)
      : "1970/01/01"; // 開啟的檔案日期

    let res = [[], [], [], [], []];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < HOURS_COUNT; j++) {
        const hour = j < 10 ? "0" + j : j.toString(); // 小時少於二位數補0
        res[i].push({
          label: `${dates_times}, ${hour}:00:00`,
          y: twoDecimal(data[i][j] * scale),
        });
      }
    }

    return res[index];
  }

  // log的時間範圍
  function getStartAndEndDate(sd, ed) {
    const filterData = chartData.filter(
      (item) => item[0]?.slice(6, 10) === "2023"
    );

    const length = filterData.length;
    sd = formatDate(filterData[0]?.[0]);
    ed = formatDate(filterData[length - 1]?.[0]);

    return sd + " ~ " + ed;
  }

  // 空調壓縮機資料
  function getAirConditionerData(arr) {
    const targetColumns = ["時間 \\ 位址", "0xde2", "0xdc4"];
    const results = {
      "0xde2": [],
      "0xdc4": [],
    };

    // 獲取targetColumns的index
    const _index = arr[0]?.reduce((acc, curr, index) => {
      if (targetColumns.includes(curr)) {
        acc.push(index);
      }

      return acc;
    }, []);

    let arrStepLine = arr.map((item) => [
      item[_index[0]],
      item[_index[1]],
      item[_index[2]],
    ]);

    // 過濾不是"2023"的資料
    arrStepLine = arrStepLine.filter((item) => item[0].slice(6, 10) === "2023");

    // 將資料轉換成canvas.js圖表用的格式
    arrStepLine.forEach((data) => {
      results["0xde2"].push({
        label: data[0],
        y: Number(data[1]),
      });

      results["0xdc4"].push({
        label: data[0],
        y: Number(data[2]),
      });
    });

    return results;
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
        toolTipContent: "日期&時間：{label}<br />{name}：{y} ℃",
        name: "室內A1溫度",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: GetChartData(0, tempData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內A2溫度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: GetChartData(1, tempData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B1溫度",
        color: "#007500",
        showInLegend: true,
        dataPoints: GetChartData(2, tempData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室內B2溫度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: GetChartData(3, tempData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} ℃",
        name: "室外溫度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: GetChartData(4, tempData),
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
        toolTipContent: "日期&時間：{label}<br />{name}：{y} %",
        name: "室內A1濕度",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: GetChartData(0, humData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內A2濕度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: GetChartData(1, humData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B1濕度",
        color: "#007500",
        showInLegend: true,
        dataPoints: GetChartData(2, humData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B2濕度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: GetChartData(3, humData),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室外濕度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: GetChartData(4, humData),
      },
    ],
  };

  const options_airConditioner = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "空調壓縮機啟動狀態",
      fontSize: 30,
    },
    axisY: {
      title: "",
      viewportMaximum: 1.3,
      viewportMinimum: -0.3,
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
        axisYIndex: 0,
        toolTipContent: "日期&時間：{label}<br />{name}：{y}",
        name: "空調A壓縮機",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: getAirConditionerData(chartData)["0xde2"],
      },
      {
        type: "stepLine",
        axisYIndex: 0,
        toolTipContent: "{name}：{y}",
        name: "空調B壓縮機",
        color: "#82D900",
        showInLegend: true,
        dataPoints: getAirConditionerData(chartData)["0xdc4"],
      },
    ],
  };

  return (
    <div className="read_csv">
      <h1>TCN01A1環控報表</h1>
      <div className="input-wrap">
        <div className="button-wrap">
          <input type="file" accept=".csv" onChange={onChangetempInput} />
          <button onClick={handletempData}>讀取</button>
        </div>
        <label className="date-range">時間範圍：{getStartAndEndDate()}</label>
      </div>

      <div className="chart-wrap chart-wrap1">
        <CanvasJSChart options={options_temp} />
      </div>
      <div className="chart-wrap chart-wrap2">
        <CanvasJSChart options={options_hum} />
      </div>
      <div className="chart-wrap chart-wrap3">
        <CanvasJSChart options={options_airConditioner} />
      </div>
    </div>
  );
};
