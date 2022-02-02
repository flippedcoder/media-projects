
import { useState } from 'react'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'

const CREATE_VIDEO_MUTATION = gql`
  mutation CreateVideoMutation($input: CreateVideoInput!) {
    createVideo(input: $input) {
      id
      url
      srtFile
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

const GET_VIDEOS = gql`
  query {
    videos {
      url
      srtFile
    }
  }
`

interface CloudinaryResult {
  info: {
    url: string
  }
}

const VideoPage = () => {
  const { data, loading } = useQuery(GET_VIDEOS)
  const [createVideo] = useMutation(CREATE_VIDEO_MUTATION)
  const [url, setUrl] = useState<string>("")
  const [srtFile, setSrtFile] = useState<string>("")

  function uploadVideoFn(results: CloudinaryResult) {
    const imageInfo = results.info

    setUrl(imageInfo.url)
  }

  async function uploadSubtitleFn(e) {
    const uploadApi = `https://api.cloudinary.com/v1_1/milecia/raw/upload`

    const formData = new FormData()
    formData.append('file', e.currentTarget.value)
    formData.append('upload_preset', 'cwt1qiwn')

    const cloudinaryRes = await fetch(uploadApi, {
      method: 'POST',
      body: formData,
    })

    setSrtFile(cloudinaryRes.url)
  }

  function createVideoRecord() {
    const input = {
      url: url,
      srtFile: srtFile,
    }

    createVideo({ variables: { input } })
  }

  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <>
      <MetaTags title="Video" description="Video page" />
      <h1>VideoPage</h1>
      <WidgetLoader />
      <Widget
        sources={['local', 'camera']}
        cloudName={process.env.CLOUD_NAME}
        uploadPreset={'cwt1qiwn'}
        buttonText={'Add Video'}
        style={{
          color: 'white',
          border: 'none',
          width: '120px',
          backgroundColor: 'green',
          borderRadius: '4px',
          height: '25px',
        }}
        folder={'subtitled_videos'}
        onSuccess={uploadVideoFn}
      />
      <input type="file" onChange={uploadSubtitleFn} />
      <button style={{ display: 'block' }} onClick={createVideoRecord}>Make this video record</button>
      <div style={{ display: 'block' }}>
        {data?.videos && 
          data?.videos.map(image => (
            <video
              controls
              key={image.name}
              style={{ height: '500px', width: '500px' }}
            >
              <source src={`https://res.cloudinary.com/milecia/video/upload/l_subtitles:sample_heeir8.srt/elephant_herd.mp4`}></source>
            </video>
          ))
        }
      </div>
    </>
  )
}

export default VideoPage
