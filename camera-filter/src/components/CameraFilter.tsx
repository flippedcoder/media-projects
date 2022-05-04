import { useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import p5 from "p5";

let cam: any, custShader: any;

function sketch(p: any) {
  // p is a reference to the p5 instance this sketch is attached to
  p.preload = () => {
    custShader = p.loadShader("../assets/webcam.vert", "../assets/webcam.frag");
  };

  p.setup = () => {
    // shaders require WEBGL mode to work
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noStroke();

    // initialize the webcam at the window size
    cam = p.createCapture(p.VIDEO);
    cam.size(p.windowWidth, p.windowHeight);

    // hide the html element that createCapture adds to the screen
    cam.hide();
  };

  p.draw = () => {
    // shader() sets the active shader with our shader
    p.shader(custShader);

    // lets just send the cam to our shader as a uniform
    custShader.setUniform("tex0", cam);

    // the size of one pixel on the screen
    custShader.setUniform("stepSize", [1.0 / p.width, 1.0 / p.height]);

    // how far away to sample from the current pixel
    // 1 is 1 pixel away
    custShader.setUniform("dist", 3.0);

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };
}

export default function CameraFilter() {
  const p5ContainerRef = useRef();

  useEffect(() => {
    // On component creation, instantiate a p5 object with the sketch and container reference
    const p5Instance = new p5(sketch, p5ContainerRef.current);

    // On component destruction, delete the p5 instance
    return () => {
      p5Instance.remove();
    };
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    if (p5ContainerRef.current === null) {
      return;
    }

    // @ts-ignore
    const dataUrl = await toPng(p5ContainerRef.current, { cacheBust: true });

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
      {/* @ts-ignore */}
      <div id="camera" ref={p5ContainerRef}></div>
      <button type="submit" onClick={submit}>
        Save picture
      </button>
    </>
  );
}
