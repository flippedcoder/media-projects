import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [classification, setClassification] = useState('')
  const [imageUrl, setImageUrl] = useState()

  function getImageLabel(results) {
    setImageUrl(results.info.url)

    const data = {
      image_url: results.info.url,
      classification: 'placeholder',
    }

    axios.post('http://127.0.0.1:8001/api/classifier/', data)
    .then(response => {
      setClassification(response.data.data.classification)
    })
  }

  return (
    <div style={{ margin: '24px' }}>
      <WidgetLoader />
      <Widget
        sources={['local', 'camera']}
        cloudName={'milecia'}
        uploadPreset={'cwt1qiwn'}
        buttonText={'Upload Image'}
        style={{
          color: 'white',
          border: 'none',
          width: '120px',
          backgroundColor: 'green',
          borderRadius: '4px',
          height: '25px',
        }}
        folder={'images_to_classify'}
        onSuccess={getImageLabel}
      />
      {
        classification !== '' &&
        <>
          <h2>{classification}</h2>
          <img src={imageUrl} height={250} width={250} alt='uploaded by user' />
        </>
      }
    </div>
  );
}

export default App;
