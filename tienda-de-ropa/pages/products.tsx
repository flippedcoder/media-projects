import Image from 'next/image';
import Link from 'next/link'
import styled from 'styled-components'
import prisma from '../prisma'

interface Product {
    id: string
    name: string
    category: string
    price: number
    image: string
    description: string
}

const HoverCard = styled.div`
    margin: 12px;
    padding: 12px;
    width: 30%;

    &:hover {
        border: 1px solid #c4c4c4;
        cursor: pointer;
    }
`

const ToCart = styled.div`
    border: 1px solid #c4c4c4;
    background-color: #abacab;
    width: 150px;
`

function Products({ products }) {
    return (
        <div style={{ margin: '24px' }}>
            <h1>Everything in the store</h1>
            <div style={{ display: 'flex' }}>
                {
                    products.map((product: Product) => (
                        <Link
                            passHref
                            key={product.name}
                            href={`/product/${encodeURIComponent(product.id)}`}
                        >
                            <HoverCard>
                                <Image src={product.image} alt={product.description} height={250} width={250} />
                                <h2>{product.name}</h2>
                                <p>{product.category}</p>
                            </HoverCard>
                        </Link>
                    ))
                }
            </div>
            <Link passHref href={`/cart`}>
                <ToCart>Go to Cart</ToCart>
            </Link>
        </div>
    )
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
    const products = await prisma.product.findMany()

    return {
        props: {
            products,
        },
    }
}

export default Products