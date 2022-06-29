import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Options } from "../index";

interface FormProps {
  options: Options;
  updateAvatar: (options: any) => void;
}

const Form = ({ options, updateAvatar }: FormProps) => {
  return (
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
  );
};

export default Form;
