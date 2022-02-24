import useSwr from 'swr'
import Image from 'next/image';
import styled from 'styled-components';
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget';
import { useState } from 'react';
import Vibrant from "node-vibrant";

interface ColorPalette {
    colorHigh: string
    colorMid: string
    colorLow: string
}
interface Image extends ColorPalette {
    name: string
    src: string
}

interface CloudinaryResult {
    info: {
        url: string
    }
}

const ColorBlot = styled.div`
    background-color: ${(props: { hexCode: string }) => props.hexCode};
    height: 140px;
    width: 140px;
`

const fetcher = (url: string, method: string = 'GET', data?: Image) => fetch(url, {
    method: method,
    body: JSON.stringify(data)
}).then((res) => res.json())

export default function PaletteGenerator() {
    const { data, error } = useSwr(`/api/images`, fetcher)
    const [name, setName] = useState<string>("")
    const [url, setUrl] = useState<string>("")
    const [palette, setPalette] = useState<ColorPalette>()

    if (error) return <div>Failed to load images</div>
    if (!data) return <div>Loading...</div>

    async function uploadVideoFn(results: CloudinaryResult) {
        const url = results.info.url
        const img = document.createElement('img')
        img.crossOrigin = "Anonymous"
        img.src = url
        const paletteData = await Vibrant.from(img).getPalette()

        setUrl(url)
        setPalette({
            colorHigh: paletteData.LightVibrant?.getHex() || '',
            colorMid: paletteData.Muted?.getHex() || '',
            colorLow: paletteData.DarkVibrant?.getHex() || ''
        })
    }

    function saveColorPalette() {
        if (palette != undefined) {
            const result = {
                name: name,
                src: url,
                colorHigh: palette.colorHigh,
                colorMid: palette.colorMid,
                colorLow: palette.colorLow
            }
            fetcher('/api/images', 'POST', result)
        }
    }

    return (
        <>
            <input type="text" onChange={e => setName(e.currentTarget.value)} />
            <WidgetLoader />
            <Widget
                sources={['local', 'camera']}
                cloudName={'milecia'}
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
            <button style={{ display: 'block' }} onClick={saveColorPalette}>Generate color palette</button>
            {url != "" && palette != undefined &&
                <div>
                    <h2>{name}</h2>
                    <Image src={url} alt={name} height={240} width={240} />
                    <ColorBlot hexCode={palette.colorHigh}>{palette.colorHigh}</ColorBlot>
                    <ColorBlot hexCode={palette.colorMid}>{palette.colorMid}</ColorBlot>
                    <ColorBlot hexCode={palette.colorLow}>{palette.colorLow}</ColorBlot>
                </div>
            }
            {data.map((image: Image) => (
                <div key={image.name}>
                    <h2>{image.name}</h2>
                    <Image src={image.src} alt={image.name} height={240} width={240} />
                    <ColorBlot hexCode={image.colorHigh}>{image.colorHigh}</ColorBlot>
                    <ColorBlot hexCode={image.colorMid}>{image.colorMid}</ColorBlot>
                    <ColorBlot hexCode={image.colorLow}>{image.colorLow}</ColorBlot>
                </div>
            ))
            }
        </>
    )
}

