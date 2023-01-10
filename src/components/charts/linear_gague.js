import {
  LinearGaugeComponent,
  AxesDirective,
  AxisDirective,
  Inject,
  PointersDirective,
  PointerDirective,
  AnnotationDirective,
  Annotations,
  AnnotationsDirective,
  RangesDirective,
  RangeDirective,
} from "@syncfusion/ej2-react-lineargauge";

const SAMPLE_CSS = `
      .control-fluid {
          padding: 0px !important;
      }`;

export const BatteryIndicator = (props) => {
  let borderColor = "#E5E7EB";

  function load(args) {
    borderColor = args.gauge.theme.indexOf("Dark") > -1 ? "white" : "#bfbfbf";
    if (
      args.gauge.theme == "Bootstrap5Dark" ||
      args.gauge.theme == "TailwindDark"
    ) {
      borderColor = "#4b5563";
    }
    if (
      args.gauge.theme == "FabricDark" ||
      args.gauge.theme == "BootstrapDark" ||
      args.gauge.theme == "MaterialDark" ||
      args.gauge.theme == "HighContrast" ||
      args.gauge.theme == "Material" ||
      args.gauge.theme == "Fabric" ||
      args.gauge.theme == "Bootstrap"
    ) {
      borderColor = "#bfbfbf";
    }
    if (args.gauge.theme == "Fluent") {
      borderColor = "#EDEBE9";
    }
    if (args.gauge.theme == "FluentDark") {
      borderColor = "#292827";
    }
    if (args.gauge.theme == "Bootstrap5" || args.gauge.theme == "Tailwind") {
      borderColor = "#E5E7EB";
    }
    args.gauge.annotations[0].content = `<div style="width: 16px;height: 37px;border: 5px solid ${borderColor};margin-left:26px;margin-top:57px;border-radius: 6px;" />`;
  }

  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="control-section">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LinearGaugeComponent
            load={load.bind(this)}
            background="transparent"
            id="gauge"
            orientation="Horizontal"
            width="200px"
            container={{
              width: 64,
              type: "RoundedRectangle",
              border: { width: 5 },
            }}
          >
            <Inject services={[Annotations]} />
            <AxesDirective>
              {/* 刻度 */}
              <AxisDirective
                minimum={0}
                maximum={100}
                line={{ width: 0 }}
                minorTicks={{ interval: 20, height: 5 }}
                majorTicks={{ interval: 20, height: 0 }}
                labelStyle={{ font: { size: "10px" } }}
              >
                {/* 隱藏箭頭 */}
                <PointersDirective>
                  <PointerDirective width={0}></PointerDirective>
                </PointersDirective>

                <RangesDirective>
                  <RangeDirective
                    start={3}
                    end={15}
                    startWidth={50}
                    endWidth={50}
                    color="#66BB6A"
                    offset={58}
                  ></RangeDirective>
                  <RangeDirective
                    start={17}
                    end={29}
                    startWidth={50}
                    endWidth={50}
                    color="#66BB6A"
                    offset={58}
                  ></RangeDirective>
                  <RangeDirective
                    start={31}
                    end={43}
                    startWidth={50}
                    endWidth={50}
                    color="#66BB6A"
                    offset={58}
                  ></RangeDirective>
                  <RangeDirective
                    start={45}
                    end={57}
                    startWidth={50}
                    endWidth={50}
                    color="#66BB6A"
                    offset={58}
                  ></RangeDirective>
                </RangesDirective>
              </AxisDirective>
            </AxesDirective>
            <AnnotationsDirective>
              {/* 電池前端 */}
              <AnnotationDirective
                axisIndex={0}
                axisValue={100}
                x={0}
                zIndex="1"
                y={5}
              ></AnnotationDirective>
              <AnnotationDirective
                content={`
                  <div 
                    style="width: 200px;
                          font-size: 24px;
                          font-weight: bold;
                          margin-top:-47px;
                          margin-left:147px;
                          color:##000000;"
                  >
                    電池健康度：${props.value}%
                  </div>
                `}
                axisIndex={0}
                axisValue={0}
                x={0}
                zIndex="1"
                y={0}
              ></AnnotationDirective>
            </AnnotationsDirective>
          </LinearGaugeComponent>
        </div>
      </div>
    </div>
  );
};
