import GaugeChart from "react-gauge-chart";

export const Gauge = (props) => {
  return (
    <>
      <GaugeChart
        id={props.id}
        nrOfLevels={10} // 刻度數目
        colors={["#3b3", "#f20"]} // 刻度左到右漸層顏色
        textColor={"#000"} // %數字體顏色
        arcWidth={0.3} // 刻度長度
        percent={props.value} // 數值
        animate={false}
        formatTextValue={(valueUnit) => valueUnit + props.unit}
      />
    </>
  );
};
