import { useState } from 'react'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const CREATE_IMAGE_MUTATION = gql`
  mutation CreateImageMutation($input: CreateImageInput!) {
    createImage(input: $input) {
      id
    }
  }
`

const GET_IMAGES = gql`
  query {
    images {
      name
      url
      description
    }
  }
`

interface CloudinaryResult {
  info: {
    original_filename: string
    url: string
  }
}

const ImagePage = () => {
  const { data, loading } = useQuery(GET_IMAGES)
  const [createImage] = useMutation(CREATE_IMAGE_MUTATION)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const uploadFn = (results: CloudinaryResult) => {
    const imageInfo = results.info

    const input = {
      name: name,
      description: description,
      url: imageInfo.url
    }
    createImage({ variables: { input } })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <MetaTags title="Image" description="Image page" />

      <h1>ImagePage</h1>
      <WidgetLoader />
      <div>
        <label htmlFor="name">Name of the image:</label>
        <input name="name" type="text" onChange={e => setName(e.currentTarget.value)} />
      </div>
      <div>
        <label htmlFor="description">Description of the image:</label>
        <input name="description" type="text" onChange={e => setDescription(e.currentTarget.value)} />
      </div>
      <Widget
        sources={['local', 'camera']}
        cloudName={'milecia'}
        uploadPreset={'cwt1qiwn'}
        buttonText={'Open'}
        style={{
          color: 'white',
          border: 'none',
          width: '120px',
          backgroundColor: 'green',
          borderRadius: '4px',
          height: '25px',
        }}
        folder={'test1'}
        onSuccess={uploadFn}
      />
      <div style={{ display: 'block' }}>
        {data?.images && 
          data?.images.map(image => (
            <img
              key={image.name}
              style={{ padding: '24px', height: '100px', width: '100px' }}
              src={`${image.url}`}
              alt={`${image.name} - ${image.description}`}
            />
          ))
        }
      </div>
    </>
  )
}

export default ImagePage
