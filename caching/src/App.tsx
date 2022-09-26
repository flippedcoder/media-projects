import { Suspense, useEffect } from "react";
import useSWR from "swr";
import { registerCache } from "./service-worker";

function App() {
  const baseURL = "http://localhost:3008";

  const fetcher = (url: string) =>
    fetch(url).then(async (res) => await res.json());

  const { data, error } = useSWR(`${baseURL}/images`, fetcher);

  if (error) return <h1>Something went wrong!</h1>;
  if (!data) return <h1>Loading...</h1>;

  useEffect(() => {
    registerCache();
  }, []);

  return (
    <div>
      <Suspense fallback={<p>Loading user images...</p>}>
        <ImageLayout images={data.images} />
      </Suspense>
    </div>
  );
}

const ImageLayout = ({
  images,
}: {
  images: { title: string; url: string }[];
}) => (
  <div>
    {images.map((image) => (
      <>
        <p>{image.title}</p>
        <img src={image.url} alt={image.title} height="150" width="150" />
      </>
    ))}
  </div>
);

export default App;
