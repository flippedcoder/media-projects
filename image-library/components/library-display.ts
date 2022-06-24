import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

interface Image {
  title: string;
  url: string;
}

@customElement("library-display")
export class LibraryDisplay extends LitElement {
  static styles = css`
    .container {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .image-card {
      padding: 8px;
      width: 250px;
    }
  `;

  images: Image[] = [
    {
      title: "dogs",
      url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1606580778/3dogs.jpg`,
    },
    {
      title: "dogs",
      url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1606580778/3dogs.jpg`,
    },
  ];

  async fetchImages() {
    const results = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.CLOUDINARY_API_KEY +
              ":" +
              process.env.CLOUDINARY_API_SECRET
          ).toString("base64")}`,
        },
      }
    ).then((r) => r.json());

    const { resources } = results;

    const allImgs: Image[] = resources.map((resource) => ({
      url: resource.secure_url,
      title: resource.public_id,
    }));

    this.images = allImgs;
  }

  render() {
    this.fetchImages();
    return html`
      <div class="container">
        ${this.images.length > 0
          ? this.images.map(
              (image) =>
                html`
                  <img
                    class="image-card"
                    src="${image.url}"
                    alt="${image.title}"
                  />
                `
            )
          : html` <div>No images</div> `}
      </div>
    `;
  }
}
