import type { NextPage } from "next";
import Head from "next/head";
import * as faces from "facesjs";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Form from "./components/Form";

export interface Options {
  body: { id: string };
  ear: { id: string };
  eye: { id: string };
  facialHair: { id: string };
  glasses: { id: string };
  hair: { id: string };
  head: { id: string };
  mouth: { id: string };
  nose: { id: string };
}

const Home: NextPage = () => {
  const [options, setOptions] = useState<Options>({
    body: { id: "body2" },
    ear: { id: "ear3" },
    eye: { id: "eye5" },
    facialHair: { id: "none" },
    glasses: { id: "glasses2-black" },
    hair: { id: "juice" },
    head: { id: "head3" },
    mouth: { id: "mouth5" },
    nose: { id: "nose9" },
  });

  const face = faces.generate();

  useEffect(() => {
    faces.display("avatar", face, options);
  }, [face, options]);

  function updateAvatar(e: any) {
    e.preventDefault();

    const updatedOptions = {
      ...options,
      [e.target.name]: { id: e.target.value },
    };

    setOptions(updatedOptions);
  }

  return (
    <div>
      <Head>
        <title>What Avatar Is Yours</title>
        <meta
          name="description"
          content="uses faces.js to make random avatars"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ width: "100%" }}>
        <Container>
          <h1>{`What's your face?`}</h1>
          <Form options={options} updateAvatar={updateAvatar} />
          <div
            id="avatar"
            style={{ margin: "0 auto", height: "auto", width: "300px" }}
          ></div>
        </Container>
      </main>
    </div>
  );
};

export default Home;
