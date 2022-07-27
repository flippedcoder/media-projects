import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [uploadedImage, setUploadedImage] = useState<any>();

  const uploadFn = async (e: any) => {
    e.preventDefault();

    const dataUrl = uploadedImage;

    const uploadApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET || ""
    );

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const values = await res.json();

      const data = {
        name: values.original_filename,
        url: values.url,
      };

      await fetch("/api/notification", {
        method: "POST",
        body: JSON.stringify(data),
      });
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <input
          type="file"
          onChange={(e) => setUploadedImage(e.currentTarget.value)}
        />
        <button onClick={uploadFn}>Upload picture</button>
      </main>
    </div>
  );
};

export default Home;
