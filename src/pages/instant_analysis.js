import { useState, useEffect } from "react";
import axios from "axios";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { Gauge_chart } from "../components/gauge";
import { Url } from "../components/api_url";
import { formatDate } from "../components/formateDate";

export const InstantAnalysis = () => {
  const [voltage, setVoltage] = useState([]);
  const [current, setCurrent] = useState([]);
  const [SOC, setSOC] = useState(0);
  const [SOH, setSOH] = useState(0);
  const [avgCellTemp, setAvgCellTemp] = useState(0);
  const [count, setCount] = useState(0);

  // 當作每筆資料的index
  const addCount = () => {
    setCount((count) => count + 1);
  };

  useEffect(() => {
    // 每五秒獲取一筆資料
    const interval = setInterval(() => {
      addCount();
      getData();
    }, 5000);

    const getData = async () => {
      const datas = await axios.get(Url); // axios資料
      const results = datas.data;

      // 將資料push進array
      setVoltage((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.SystemVolt) * 0.1, // 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);
      setCurrent((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.SystemCurrent) - 20000, // 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);

      setSOC(results.SOC * 0.001); // 依據spec做數值校正
      setSOH(results.SOH * 0.1); // 依據spec做數值校正
      setAvgCellTemp((results.AvgCellTemp - 50) * 0.01); // 依據spec做數值校正
    };
    // 清除Interval
    return () => clearInterval(interval);
  }, [count]);

  // 維持40筆資料
  if (voltage.length > 40) {
    voltage.shift();
  }
  if (current.length > 40) {
    current.shift();
  }
  // console.log(count);

  // 顯示or隱藏圖表線段
  const onChangeAvgVoltage = (e) => {
    if (e.dataSeries.visible === undefined || e.dataSeries.visible) {
      e.dataSeries.visible = false;
      e.dataSeries.toolTipContent = null;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  };

  // Canvas chart
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  // 電壓折線圖
  const options_voltage = {
    theme: "light2",
    zoomEnabled: true, // 縮放
    exportEnabled: true, // 存成圖檔
    title: {
      text: "電壓折線圖",
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
        toolTipContent: "Time：{label}<br />{name}：{y} V",
        name: "AvgCellVolt",
        showInLegend: true,
        dataPoints: voltage,
      },
    ],
  };

  // 電流折線圖
  const options_current = {
    theme: "light2",
    zoomEnabled: true,
    exportEnabled: true,
    title: {
      text: "電流折線圖",
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
        toolTipContent: "Time：{label}<br />{name}：{y} A",
        name: "SystemCurrent",
        showInLegend: true,
        dataPoints: current,
      },
    ],
  };

  return (
    <div className="chart">
      <div className="chart-wrap">
        <CanvasJSChart options={options_voltage} />
        <CanvasJSChart options={options_current} />
      </div>

      <div className="chart-wrap">
        <div className="wrap">
          <h2>SOC</h2>
          <Gauge_chart value={SOC} unit="%" id="gauge" />
        </div>
        <div className="wrap">
          <h2>電芯平均溫度</h2>
          <Gauge_chart value={avgCellTemp} unit="℃" id="avgCellTemp" />
        </div>
        <div className="wrap">
          <h2>電池健康度</h2>
          <canvas
            data-type="linear-gauge"
            data-value={SOH}
            data-units="%"
            data-height={200}
            data-width={450}
            data-animation-rule="linear"
          ></canvas>
        </div>
      </div>
    </div>
  );
};
