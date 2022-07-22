import { Suspense, useEffect, useState } from 'react';
import useSWR, { SWRConfig } from 'swr'
  
const fetcher = (...args) => fetch(...args).then((res) => res.json())

function App() {
  const [images, setImages] = useState([])

  const url = 'https://pokeapi.co/api/v2/pokemon/' + name

  const { data, error } = useSWR(url)

  if (error) return <h1>Something went wrong!</h1>
  if (!data) return <h1>Loading...</h1>

  useEffect(async () => {
    const imageRes = await fetch(`${process.env.CLOUD_NAME}`, {
      method: "POST"
    })

    setImages(await imageRes.json())

  }, [])

  return (
    <div>
      <Suspense fallback={<p>Loading user images...</p>}>
        <ImageLayout images={images} />
      </Suspense>
      <SWRConfig value={{ fetcher }}>
        <ImageLayout images={images} />
      </SWRConfig>
    </div>
  );
}

const ImageLayout = ({ images }: { images: { name: string, url: string }[]}) => (
  <div>
    {images.map(image => (
      <>
        <p>{image.name}</p>
        <img src={image.url} alt={image.name} />
      </>
    ))}
  </div>
) 

export default App;
