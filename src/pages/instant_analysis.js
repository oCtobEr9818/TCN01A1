import { useState, useEffect, useCallback } from "react";
import BatteryGauge from "react-battery-gauge";
import axios from "axios";
import { v4 } from "uuid";

import CanvasJSReact from "../canvasjs-3.6.7/canvasjs.react";
import { Gauge } from "../components/charts/gauge";
import { Url } from "../components/api_url";
import { formatDate } from "../components/formateDate";
import { minValue } from "../components/minValue";
import { maxValue } from "../components/maxValue";
import { lineDisplay } from "../components/charts/chart_tool/lineDisplay";

export const InstantAnalysis = () => {
  const [voltage, setVoltage] = useState([]);
  const [current, setCurrent] = useState([]);
  const [chargeCurrent, setChargeCurrent] = useState([]);
  const [disChargeCurrent, setDisChargeCurrent] = useState([]);
  const [SOC, setSOC] = useState(0);
  const [SOH, setSOH] = useState(0);
  const [avgCellTemp, setAvgCellTemp] = useState(0);
  const [maxCellTemp, setMaxCellTemp] = useState(0);
  const [minCellTemp, setMinCellTemp] = useState(0);
  const [powerStatus, setPowerStatus] = useState("");
  const [heartBeats, setHeartBeats] = useState(0);
  const [getTime, setGetTime] = useState(0);
  const [count, setCount] = useState(0);

  // axios資料
  const getData = useCallback(async () => {
    try {
      const datas = await axios.get(Url); // axios資料
      const results = datas.data;

      // 每筆資料的index
      setCount((count) => count + 1);

      // setState資料
      setVoltage((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.MBMU.SystemVolt) * 0.1, // 系統電壓 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);

      setCurrent((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.MBMU.SystemCurrent) - 20000, // 系統電流 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);
      setChargeCurrent((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.MBMU.AllowedChargeCurrent) - 20000, // 充電電流 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);
      setDisChargeCurrent((prev) => [
        ...prev,
        {
          x: count,
          y: Number(results.MBMU.AllowedDischargeCurrent) - 20000, // 放電電流 依據spec做數值校正
          label: formatDate(results.UpdateTime),
        },
      ]);

      setSOC(results.MBMU.SOC * 0.001); // SOC 依據spec做數值校正
      setSOH(results.MBMU.SOH * 0.1); // SOH 依據spec做數值校正

      setAvgCellTemp((results.MBMU.AvgCellTemp - 50) * 0.01); // 平均電芯溫度 依據spec做數值校正
      setMaxCellTemp(results.MBMU.MaxCellTemp - 50); // 最高電芯溫度 依據spec做數值校正
      setMinCellTemp(results.MBMU.MinCellTemp - 50); // 最低電芯溫度 依據spec做數值校正

      setPowerStatus(results.MBMU.PowerStatus); // 電源狀態
      setHeartBeats(results.MBMU.Heartbeats); // 電源心跳
      setGetTime(formatDate(results.UpdateTime)); // 最新資料時間
    } catch (error) {
      console.log(error);
    }
  }, [count]);

  // 每五秒獲取一筆資料
  useEffect(() => {
    const _getData = setInterval(() => {
      getData();
    }, 5000);

    // 清除Interval
    return () => clearInterval(_getData);
  }, [getData]);

  // 維持40筆資料
  if (voltage.length > 40) {
    voltage.shift();
  }
  if (current.length > 40) {
    current.shift();
  }
  if (chargeCurrent.length > 40) {
    chargeCurrent.shift();
  }
  if (disChargeCurrent.length > 40) {
    disChargeCurrent.shift();
  }

  // 判斷power status狀態
  const handlePowerStatus = (status) => {
    switch (status) {
      case "0":
        return "Power off ready 全部電池櫃都下電";
      case "1":
        return "Power off ready 全部電池櫃都上電";
      case "2":
        return "Full charge status 滿充狀態";
      case "3":
        return "Power off fault 任何一個電池櫃下電失敗";
      default:
        return "電池櫃狀態待確認";
    }
  };

  // CanvasJS chart
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
      viewportMinimum: minValue(voltage) - 50,
      viewportMaximum: maxValue(voltage) + 50,
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
      itemclick: lineDisplay,
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
      {
        type: "spline",
        toolTipContent: "{name}：{y} A",
        name: "ChargeCurrent",
        showInLegend: true,
        dataPoints: chargeCurrent,
      },
      {
        type: "spline",
        toolTipContent: "{name}：{y} A",
        name: "DisChargeCurrent",
        showInLegend: true,
        dataPoints: disChargeCurrent,
      },
    ],
  };

  return (
    <div className="chart">
      <h1>Etica BMS System</h1>

      <div className="data-table">
        <ul>
          <li key={v4()}>電源狀態</li>
          <li key={v4()}>最高電芯溫度</li>
          <li key={v4()}>最低電芯溫度</li>
          <li key={v4()}>HeartBeats</li>
          <li key={v4()}>最後更新時間</li>
        </ul>
        <ul>
          <li key={v4()}>{handlePowerStatus(powerStatus)}</li>
          <li key={v4()}>{maxCellTemp}℃</li>
          <li key={v4()}>{minCellTemp}℃</li>
          <li key={v4()}>{heartBeats}</li>
          <li key={v4()}>{getTime}</li>
        </ul>
      </div>

      <div className="chart-wrap">
        <CanvasJSChart options={options_voltage} />
        <CanvasJSChart options={options_current} />
      </div>

      <div className="chart-wrap chart-wrap2">
        <div className="wrap">
          <h2>SOC</h2>
          {/* react-gauge-chart */}
          <Gauge value={SOC} unit="%" id="gauge" />
        </div>
        <div className="wrap">
          <h2>電芯平均溫度</h2>
          {/* react-gauge-chart */}
          <Gauge value={avgCellTemp} unit="℃" id="avgCellTemp" />
        </div>
        <div className="wrap">
          <h2>電池健康度</h2>
          <BatteryGauge // react-battery-gauge
            value={SOH}
            size={250}
            animated={true}
            customization={{
              batteryBody: {
                strokeWidth: 3,
                cornerRadius: 8,
                fill: "none",
                strokeColor: "#111",
              },
              batteryCap: {
                fill: "none",
                strokeWidth: 3,
                strokeColor: "#111",
                cornerRadius: 2,
                capToBodyRatio: 0.4,
              },
              batteryMeter: {
                fill: "green",
                lowBatteryValue: 50,
                lowBatteryFill: "red",
                outerGap: 2,
                noOfCells: 10, // 電池格數
                interCellsGap: 1,
              },
              readingText: {
                lightContrastColor: "#111",
                darkContrastColor: "#fff",
                lowBatteryColor: "#000",
                fontFamily: "Helvetica",
                fontSize: 16,
                showPercentage: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
