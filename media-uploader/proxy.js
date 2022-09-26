const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const port = 3003

app.use(cors())

app.get('/images', async (req, res) => {
    await axios.get(`https://api.cloudinary.com/v1_1/milecia/resources/image`,
		{
			headers: {
			Authorization: `Basic ${Buffer.from(
				"655265275423931" +
				":" +
				"_8Gz0JXpM1OpirsIRuaA4bWqDvI"
			).toString("base64")}`,
			},
		}
    ).then((response) => {
		const { resources } = response.data;

		const allImgs = resources.map((resource) => ({
            url: resource.secure_url,
            title: resource.public_id,
        }));
    
        res.json({images: allImgs})
    });
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
})