import { useState } from "react";
import QRCode from "react-qr-code";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function QrGenerator() {
  const [qrValue, setQrValue] = useState("placeholding");

  function generateCode(e: any) {
    e.preventDefault();

    setQrValue(`
        <div>
            <p>${e.currentTarget.fullName.value}</p>
            <p>${e.currentTarget.jobTitle.value}</p>
            <p>${e.currentTarget.shortDescription.value}</p>
            <p>${e.currentTarget.email.value}</p>
            <p>${e.currentTarget.website.value}</p>
        </div>
    `);
  }

  return (
    <Container>
      <form
        onSubmit={(e) => generateCode(e)}
        style={{ marginBottom: "24px", width: "800px" }}
      >
        <Stack spacing={2}>
          <TextField
            id="fullName"
            label="Full Name"
            variant="standard"
            name="fullName"
          />
          <TextField
            id="jobTitle"
            label="Job Title"
            variant="standard"
            name="jobTitle"
          />
          <TextField
            id="shortDescription"
            label="Short Description"
            variant="standard"
            name="shortDescription"
          />
          <TextField id="email" label="Email" variant="standard" name="email" />
          <TextField
            id="website"
            label="Website"
            variant="standard"
            name="website"
          />
          <Button variant="contained" type="submit">
            Generate code
          </Button>
        </Stack>
      </form>
      <QRCode value={qrValue} style={{ display: "block", margin: "0 auto" }} />
    </Container>
  );
}
