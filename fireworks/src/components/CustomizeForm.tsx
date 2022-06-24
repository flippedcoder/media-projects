import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { CustomizationProps } from "./Fireworks";

interface CustomizeFormProps {
  customizations: CustomizationProps;
  setCustomizations: (options: CustomizationProps) => void;
}

export default function CustomizeForm({
  customizations,
  setCustomizations,
}: CustomizeFormProps) {
  function updateFireworks(e: any) {
    e.preventDefault();

    const { color, size, duration, sparkAmount, rows } = customizations;

    const newValues = {
      color: e.currentTarget.color.value || color,
      size:
        e.currentTarget.size.value !== ""
          ? Number(e.currentTarget.size.value)
          : size,
      duration:
        e.currentTarget.duration.value !== ""
          ? Number(e.currentTarget.duration.value)
          : duration,
      sparkAmount:
        e.currentTarget.sparkAmount.value !== ""
          ? Array.from(Array(Number(e.currentTarget.sparkAmount.value)))
          : sparkAmount,
      rows:
        e.currentTarget.rows.value !== ""
          ? Array.from(Array(Number(e.currentTarget.rows.value)))
          : rows,
    };

    setCustomizations(newValues);
  }

  return (
    <Container>
      <form
        onChange={(e) => updateFireworks(e)}
        style={{ marginBottom: "24px", marginTop: "24px", width: "800px" }}
      >
        <Stack spacing={2}>
          <TextField id="color" label="Color" variant="standard" name="color" />
          <TextField id="size" label="Size" variant="standard" name="size" />
          <TextField
            id="sparkAmount"
            label="Number of sparks"
            variant="standard"
            name="sparkAmount"
          />
          <TextField
            id="rows"
            label="Number of firework rows"
            variant="standard"
            name="rows"
          />
          <TextField
            id="duration"
            label="Duration"
            variant="standard"
            name="duration"
          />
        </Stack>
      </form>
    </Container>
  );
}
