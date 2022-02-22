import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import prisma from '../../../prisma'

function Product({ product }) {
    function addToCart() {
        let arr = []

        const existingItems = window.localStorage.getItem('lineItems')

        if (existingItems != null) {
            arr = JSON.parse(existingItems)
        }

        const itemForCart = {
            name: product.name,
            price: product.price,
            imageUrl: product.image
        }

        arr.push(itemForCart)

        window.localStorage.setItem('lineItems', JSON.stringify(arr))
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Image src={product.image} alt={product.description} height={250} width={250} />
                <div style={{ width: '30%' }}>
                    <h2>{product.name}</h2>
                    <p>{product.category}</p>
                    <p>$ {product.price}</p>
                    <button onClick={addToCart}>Add to cart</button>
                </div>
            </div>
            <Link passHref href={`/products`}>
                <Back>Back to Products</Back>
            </Link>
        </>
    )
}

// This gets called on every request
export async function getServerSideProps(context) {
    const id = context.params.id

    const product = await prisma.product.findUnique({
        where: { id }
    })

    return {
        props: {
            product,
        },
    }
}

const Back = styled.div`
    border: 1px solid #c4c4c4;
    background-color: #abacab;
    width: 150px;
`

export default Product