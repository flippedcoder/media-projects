import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import * as d3 from "d3";

type ConfigDataType = {
  color: string;
  svgHeight: number;
  svgWidth: number;
  xMultiplier: number;
  yMultiplier: number;
  othWidth: number;
  data: number[];
};

function drawArt(configData: ConfigDataType) {
  const svg = d3
    .select("#art")
    .append("svg")
    .attr("width", configData.svgWidth)
    .attr("height", configData.svgHeight)
    .style("margin-left", 100);

  svg
    .selectAll("rect")
    .data(configData.data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * configData.xMultiplier)
    .attr("y", (d, i) => 300 - configData.yMultiplier * d)
    .attr("width", configData.othWidth)
    .attr("height", (d, i) => d * configData.yMultiplier)
    .attr("fill", configData.color);
}

export default function Art() {
  const d3ContainerRef = useRef();
  const [configData, setConfigData] = useState<ConfigDataType>({
    color: "black",
    svgHeight: 300,
    svgWidth: 700,
    xMultiplier: 90,
    yMultiplier: 15,
    othWidth: 65,
    data: [12, 5, 6, 6, 9, 10],
  });

  useEffect(() => {
    drawArt(configData);
  }, [configData]);

  function updateArt(e: any) {
    e.preventDefault();

    const newConfigs = {
      color: e.target.color?.value || configData.color,
      svgHeight: e.target.svgHeight?.value || configData.svgHeight,
      svgWidth: e.target.svgWidth?.value || configData.svgWidth,
      xMultiplier: e.target.xMultiplier?.value || configData.xMultiplier,
      yMultiplier: e.target.yMultiplier?.value || configData.yMultiplier,
      othWidth: e.target.othWidth?.value || configData.othWidth,
      data: e.target.data?.value || configData.data,
    };

    setConfigData(newConfigs);
  }

  async function submit(e: any) {
    e.preventDefault();

    if (d3ContainerRef.current === null) {
      return;
    }

    // @ts-ignore
    const dataUrl = await toPng(d3ContainerRef.current, { cacheBust: true });

    const uploadApi = `https://api.cloudinary.com/v1_1/milecia/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "cwt1qiwn");

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    });
  }

  return (
    <>
      <form onSubmit={updateArt}>
        <div>
          <label htmlFor="color">Color</label>
          <input type="text" name="color" onChange={(e) => e.target.value} />
        </div>
        <div>
          <label htmlFor="svgHeight">SVG Height</label>
          <input
            type="number"
            name="svgHeight"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="svgWidth">SVG Width</label>
          <input
            type="number"
            name="svgWidth"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="xMultiplier">X Multiplier</label>
          <input
            type="number"
            name="xMultiplier"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="yMultiplier">Y Multiplier</label>
          <input
            type="number"
            name="yMultiplier"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="othWidth">Other Width</label>
          <input
            type="number"
            name="othWidth"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="data">Some Numbers</label>
          <input type="text" name="data" onChange={(e) => e.target.value} />
        </div>
        <button type="submit">See Art</button>
      </form>
      {/* @ts-ignore */}
      <div id="art" ref={d3ContainerRef}></div>
      <button type="submit" onClick={submit}>
        Save picture
      </button>
    </>
  );
}
