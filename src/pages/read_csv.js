import { useState, useCallback, useMemo } from "react";

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

  // 平均室內外濕度資料
  const HOURS_COUNT = 24;
  const targetColumns = ["0x221e", "0x221f", "0x2220", "0x2221", "0x2225"];

  function processHumData(hum) {
    const __HumDatas = []; // 創建濕度資料的Array
    for (let i = 0; i < 5; i++) {
      let innerArray = [];
      for (let j = 0; j < 24; j++) {
        innerArray.push(0);
      }
      __HumDatas.push(innerArray);
    }

    // 獲取需要資料的index
    function getHumDataIndex(e) {
      const indexHum = hum[0]?.reduce((acc, curr, index) => {
        if (targetColumns.includes(curr)) {
          acc.push(index);
        }

        return acc;
      }, []);

      return indexHum[e];
    }

    // 移除不需要資料項目
    const humData = hum.filter((item) => item[0].slice(6, 10) === "2023");

    // 將資料做平均計算
    for (let i = 0; i < HOURS_COUNT; i++) {
      const hour = i < 10 ? "0" + i : i.toString(); // 小時少於二位數補0
      let items = humData.filter((item) => item[0]?.slice(12, 14) === hour);

      for (let j = 0; j < __HumDatas.length; j++) {
        items.forEach((data) => {
          __HumDatas[j][i] +=
            (Number(data[getHumDataIndex(j)])
              ? Number(data[getHumDataIndex(j)])
              : 0) / items[i].length;
        });
      }
    }

    return __HumDatas;
  }

  // 將濕度資料轉換成canvas.js用的資料格式
  function GetHumData(index) {
    const data = useMemo(() => processHumData(humDatas), []);
    const dates_times = humDatas[1]?.[0]?.slice(0, 10); // 開啟的檔案日期

    const results = useMemo(() => {
      let results = [[], [], [], [], []];

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < HOURS_COUNT; j++) {
          const hour = j < 10 ? "0" + j : j.toString(); // 小時少於二位數補0
          results[i].push({
            label: `${dates_times}, ${hour}:00:00`,
            y: twoDecimal(data[i][j]),
          });
        }
      }

      return results;
    }, [data, dates_times]);

    return results[index];
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
        toolTipContent: "日期&時間：{label}<br />{name}：{y} %",
        name: "室內A1濕度",
        color: "#2828FF",
        showInLegend: true,
        dataPoints: GetHumData(0),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內A2濕度",
        color: "#97CBFF",
        showInLegend: true,
        dataPoints: GetHumData(1),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B1濕度",
        color: "#007500",
        showInLegend: true,
        dataPoints: GetHumData(2),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室內B2濕度",
        color: "#82D900",
        showInLegend: true,
        dataPoints: GetHumData(3),
      },
      {
        type: "spline",
        axisYIndex: 0,
        toolTipContent: "{name}：{y} %",
        name: "室外濕度",
        color: "#FF2D2D",
        showInLegend: true,
        dataPoints: GetHumData(4),
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
