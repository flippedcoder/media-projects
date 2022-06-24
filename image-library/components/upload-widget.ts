import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

async function uploadReq() {
  const uploadApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  const dataUrl = "";

  const formData = new FormData();
  formData.append("file", dataUrl);
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

  await fetch(uploadApi, {
    method: "POST",
    body: formData,
  });
}
@customElement("upload-widget")
export class UploadWidget extends LitElement {
  static styles = css`
    button {
      font-size: 18px;
      padding: 2px 5px;
    }
  `;

  render() {
    return html`
      <form onSubmit=${uploadReq}>
        <label htmlFor="imageUploader">Upload an image here</label>
        <input name="imageUploader" type="file" />
        <button type="submit">Add image</button>
      </form>
    `;
  }
}
