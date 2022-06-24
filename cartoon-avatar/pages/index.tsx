import type { NextPage } from "next";
import Head from "next/head";
import * as faces from "facesjs";
import { useEffect, useRef, useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

interface Options {
  body: string;
  ear: string;
  eye: string;
  facialHair: string;
  glasses: string;
  hair: string;
  head: string;
  nose: string;
}

const Home: NextPage = () => {
  const [options, setOptions] = useState({
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
          <Container>
            <form
              style={{
                marginBottom: "24px",
                marginTop: "24px",
                width: "800px",
              }}
            >
              <Stack spacing={2}>
                <FormControl variant="standard">
                  <InputLabel id="body">Body</InputLabel>
                  <Select
                    name="body"
                    id="body"
                    value={options.body.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Body"
                  >
                    <MenuItem value="body">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="body2">Type 1</MenuItem>
                    <MenuItem value="body3">Type 2</MenuItem>
                    <MenuItem value="body5">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="ear">Ear</InputLabel>
                  <Select
                    name="ear"
                    id="ear"
                    value={options.ear.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Ear"
                  >
                    <MenuItem value="ear1">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="ear2">Type 1</MenuItem>
                    <MenuItem value="ear3">Type 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="eye">Eye</InputLabel>
                  <Select
                    name="eye"
                    id="eye"
                    value={options.eye.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Eye"
                  >
                    <MenuItem value="eye13">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="eye5">Type 1</MenuItem>
                    <MenuItem value="eye19">Type 2</MenuItem>
                    <MenuItem value="eye12">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="facialHair">Facial Hair</InputLabel>
                  <Select
                    name="facialHair"
                    id="facialHair"
                    value={options.facialHair.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Facial Hair"
                  >
                    <MenuItem value="none">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="fullgoatee4">Type 1</MenuItem>
                    <MenuItem value="loganSoul">Type 2</MenuItem>
                    <MenuItem value="sideburns3">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="glasses">Glasses</InputLabel>
                  <Select
                    name="glasses"
                    id="glasses"
                    value={options.glasses.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Glasses"
                  >
                    <MenuItem value="none">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="glasses1-primary">Type 1</MenuItem>
                    <MenuItem value="glasses2-primary">Type 2</MenuItem>
                    <MenuItem value="glasses2-black">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="hair">Hair</InputLabel>
                  <Select
                    name="hair"
                    id="hair"
                    value={options.hair.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Hair"
                  >
                    <MenuItem value="blowoutFade">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="curly">Type 1</MenuItem>
                    <MenuItem value="juice">Type 2</MenuItem>
                    <MenuItem value="parted">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="head">Head</InputLabel>
                  <Select
                    name="head"
                    id="head"
                    value={options.head.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Head"
                  >
                    <MenuItem value="head8">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="head14">Type 1</MenuItem>
                    <MenuItem value="head3">Type 2</MenuItem>
                    <MenuItem value="head10">Type 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel id="nose">Nose</InputLabel>
                  <Select
                    name="nose"
                    id="nose"
                    value={options.nose.id}
                    onChange={(e) => updateAvatar(e)}
                    label="Nose"
                  >
                    <MenuItem value="nose6">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="nose5">Type 1</MenuItem>
                    <MenuItem value="nose13">Type 2</MenuItem>
                    <MenuItem value="nose9">Type 3</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </form>
          </Container>
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
