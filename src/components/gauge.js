export const Gauge = (soc) => {
  console.log("test");
  const arr = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <canvas
      data-type="radial-gauge"
      data-width="300"
      data-height="300"
      data-units="SOC(V)"
      data-value={soc}
      data-min-value="0"
      data-max-value="100"
      data-major-ticks={arr}
      data-minor-ticks="10"
      data-stroke-ticks="true"
      data-highlights='[
        {"from": 70, "to": 100, "color": "rgba(200, 50, 50, .75)"}
    ]'
      data-color-plate="#fff"
      data-border-shadow-width="0"
      data-borders="false"
      data-needle-type="arrow"
      data-needle-width="2"
      data-needle-circle-size="7"
      data-needle-circle-outer="true"
      data-needle-circle-inner="false"
      data-animation-duration="1500"
      data-animation-rule="linear"
      id="gauge"
    ></canvas>
  );
};
