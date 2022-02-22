import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

interface CartItem {
    name: string
    price: number
    imageUrl: string
}


function Cart() {
    let cartItems

    if (typeof window !== "undefined") {
        cartItems = window.localStorage.getItem('lineItems')
    }

    if (!cartItems) {
        return <div>No items in the cart</div>
    }

    const parsedCartItems = JSON.parse(cartItems)

    return (
        <Container>
            <h2>Tu Carrito</h2>
            {parsedCartItems.map((item: CartItem) => (
                <CartItem key={item.name}>
                    <div>Name: {item.name}</div>
                    <div>Price: {item.price}</div>
                    <Image src={item.imageUrl} alt={item.name} height={100} width={100} />
                </CartItem>
            ))}
            <Link passHref href={`/products`}>
                <Back>Back to Products</Back>
            </Link>
        </Container>
    )
}

const Back = styled.div`
    border: 1px solid #c4c4c4;
    background-color: #abacab;
    width: 150px;
`

const CartItem = styled.div`
    border: 1px solid #c4c4c4;
    display: flex;
    height: 100px;
    justify-content: space-between;
    margin: 12px;
    padding: 24px;
`

const Container = styled.div`
    margin: 24px;
    padding: 12px;
`

export default Cart