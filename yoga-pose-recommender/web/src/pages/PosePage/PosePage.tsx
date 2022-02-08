import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { useState } from 'react'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

interface CloudinaryResult {
  info: {
    url
  }
}

const CREATE_POSE_MUTATION = gql`
  mutation CreatePoseMutation($input: CreatePoseInput!) {
    createPose(input: $input) {
      name
    }
  }
`

const GET_POSES_BY_CATEGORY = gql`
  query GetPosesByCategory($category: String!) {
    getPosesByCategory(category: $category) {
      category
      name
      url
      you_url
    }
  }
`

const PosePage = () => {
  const [category, setCategory] = useState<string>("upright")
  const [name, setName] = useState<string>("tree")
  const { data, loading } = useQuery(GET_POSES_BY_CATEGORY, {
    variables: { category }
  })
  const [createPose] = useMutation(CREATE_POSE_MUTATION)

  function uploadImagesFn(res: CloudinaryResult) {
    const input = {
      category: category,
      name: name,
      url: res.info?.url,
      you_url: res.info?.url
    }

    createPose({ variables: { input } })
  }

  if (loading) {
    <div>loading...</div>
  }

  return (
    <>
      <MetaTags title="Pose" description="Pose page" />
      <div>
        <label htmlFor="name">Name of the pose:</label>
        <input name="name" type="text" onChange={e => setName(e.currentTarget.value)} />
      </div>
      <div>
        <label htmlFor="category">Category of the pose:</label>
        <select name="category" onChange={e => setCategory(e.currentTarget.value)}>
          <option value="upright">Upright</option>
          <option value="laying">Laying</option>
          <option value="side">Side</option>
          <option value="back">Back</option>
          <option value="arms">Arms</option>
        </select>
      </div>
      <WidgetLoader />
      <Widget
        sources={['local', 'camera']}
        cloudName={'milecia'}
        uploadPreset={'cwt1qiwn'}
        buttonText={'Add Pose Images'}
        multiple={true}
        cropping={false}
        folder={'yoga_poses'}
        style={{
          color: 'white',
          border: 'none',
          width: '120px',
          backgroundColor: 'green',
          borderRadius: '4px',
          height: '25px',
        }}
        onSuccess={uploadImagesFn}
      />
      <div style={{ display: 'block' }}>
        {data?.getPosesByCategory &&
          data?.getPosesByCategory.map(image => (
            <>
              <h2>{image.name}</h2>
              <h3>{image.category}</h3>
              <img
                key={`${image.name}_orig`}
                style={{ height: '500px', marginRight: '25px', width: '500px' }}
                src={`${image.url}`}
              />
              <img
                key={image.name}
                style={{ height: '500px', width: '500px' }}
                src={`${image.you_url}`}
              />
            </>
          ))
        }
      </div>
    </>
  )
}

export default PosePage
