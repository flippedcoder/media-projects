import { useState, useEffect } from 'preact/hooks';
import style from './style.css';

const Home = () => {
	const [images, setImages] = useState([])
	const [isFetching, setIsFetching] = useState(false);

	async function fetchPhotos() {
		setTimeout(async () => {
		await fetch("http://localhost:3006/images").then(async (data) => {
        const imageData = (await data.json()).images;
        setImages(imageData);
      })}, 2000)
	}

	function handleScroll() {
		if (
			Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight ||
			isFetching
		) return;
		setIsFetching(true);
	}

	useEffect(() => {
		fetchPhotos();
		window.addEventListener('scroll', handleScroll);
	}, [])

	if (images.length === 0) {
		return (
			<div class={ style.home }>
				<h1>Almost there...</h1>
				<div class={ style.skeleton }>Loading images...</div>
			</div>
		)
	}

	return (
		<div class={style.home}>
			<h1>These are the images</h1>
			{images.length !== 0 && images.map(image => (
					<div>
						<p>{image.title}</p>
						<img src={image.url} alt={image.title || "..."} height="150" width="150" />
					</div>
				))
			}
		</div>
	)
};

export default Home;
