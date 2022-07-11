import type { NextPage } from 'next'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import styles from '../styles/Home.module.css'

interface CloudinaryResult {
  info: {
    original_filename: string
    url: string
  }
}

const Home: NextPage = () => {
  const uploadFn = async (results: CloudinaryResult) => {
    const imageInfo = results.info

    const data = {
      name: imageInfo.original_filename,
      url: imageInfo.url
    }

    await fetch("/api/notification", {
      body: JSON.stringify(data)
    });
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <WidgetLoader />
        <Widget
          sources={['local', 'camera']}
          cloudName={process.env.CLOUDINARY_CLOUD_NAME}
          uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET}
          buttonText={'Open'}
          style={{
            color: 'white',
            border: 'none',
            width: '120px',
            backgroundColor: 'green',
            borderRadius: '4px',
            height: '25px',
          }}
          folder={'alt_text_imgs'}
          onSuccess={uploadFn}
        />
      </main>
    </div>
  )
}

export default Home
