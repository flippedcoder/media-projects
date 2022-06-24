var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, html, css } from "../node_modules/lit";
import { customElement } from "../node_modules/lit/decorators.js";
function uploadReq() {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
        const dataUrl = "";
        const formData = new FormData();
        formData.append("file", dataUrl);
        formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
        yield fetch(uploadApi, {
            method: "POST",
            body: formData,
        });
    });
}
let UploadWidget = class UploadWidget extends LitElement {
    render() {
        return html `
      <form onSubmit=${uploadReq}>
        <label htmlFor="imageUploader">Upload an image here</label>
        <input name="imageUploader" type="file" />
        <button type="submit">Add image</button>
      </form>
    `;
    }
};
UploadWidget.styles = css `
    button {
      font-size: 18px;
      padding: 2px 5px;
    }
  `;
UploadWidget = __decorate([
    customElement("upload-widget")
], UploadWidget);
export { UploadWidget };
//# sourceMappingURL=upload-widget.js.map