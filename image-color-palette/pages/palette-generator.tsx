import useSwr from 'swr'
import Image from 'next/image';
import styled from 'styled-components';

interface Image {
    name: string
    src: string
    colorHigh: string
    colorMid: string
    colorLow: string
}

const ColorBlot = styled.div`
    background-color: ${(props: {hexCode: string}) => props.hexCode};
    height: 140px;
    width: 140px;
`

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PaletteGenerator() {
    const { data, error } = useSwr(`/api/images`, fetcher)

    if (error) return <div>Failed to load images</div>
    if (!data) return <div>Loading...</div>

    return (
        <>
            {
                data.map((image: Image) => (
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

