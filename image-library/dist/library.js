var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "../node_modules/lit";
import { customElement, property } from "../node_modules/lit/decorators.js";
let Library = class Library extends LitElement {
    constructor() {
        super(...arguments);
        this.images = [];
    }
    render() {
        return html `
      <div className="container>
        ${this.images.length > 0
            ? this.images.map((image) => html ` <img src="${image.url}" alt="${image.title}" /> `)
            : html ` <div>No images</div> `}
      </div>
    `;
    }
};
Library.styles = css `
    .container {
      display: flex;
      justify-content: space-between;
    }
    .image-card {
      padding: 8px;
      width: 100%;
    }
  `;
__decorate([
    property()
], Library.prototype, "images", void 0);
Library = __decorate([
    customElement("library")
], Library);
export { Library };
//# sourceMappingURL=library.js.map