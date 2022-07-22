import { h, render } from 'preact';
import style from './style.css';

const Home = () => {
	const [images, setImages] = useState([])

	async function fetchPhotos() {
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

    const allImgs = resources.map((resource) => ({
      url: resource.secure_url,
      title: resource.public_id,
    }));

		setImages(allImgs)
	}

	render() (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			{images.length !== 0 && images.map(image => (
					<div>
						<p>{image.title}</p>
						<img src={image.url} alt={image.title} />
					</div>
				))
			}
		</div>
	)
};

export default Home;
