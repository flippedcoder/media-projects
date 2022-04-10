// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

interface Product {
  id: string
  name: string
  sku: string
  image: string
  quantity: number
  storeId: string
}

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | null>
) {
  switch (req.query.type) {
    case 'products':
      getAllProducts(req, res)
      break
    case 'product':
      getProduct(req, res)
      break
    case 'create':
      createProduct(req, res)
      break
    case 'update':
      updateProduct(req, res)
      break
    case 'delete':
      deleteProduct(req, res)
      break
    default:
      res.status(200).json([])
  }
}

async function getAllProducts(req: NextApiRequest,
  res: NextApiResponse<Product[]>) {
  const allProducts = await prisma.product.findMany()

  res.status(200).json(allProducts || [])
}

async function getProduct(req: NextApiRequest,
  res: NextApiResponse<Product | null>) {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.id
    }
  })

  res.status(200).json(product)
}

async function createProduct(req: NextApiRequest,
  res: NextApiResponse<Product>) {
  const newProduct = await prisma.product.create({
    data: {
      name: req.body.product.name,
      sku: req.body.product.sku,
      image: req.body.product.image,
      quantity: req.body.product.quantity,
      storeId: req.body.product.storeId,
    }
  })

  res.status(200).json(newProduct)
}

async function updateProduct(req: NextApiRequest,
  res: NextApiResponse<Product>) {
  const updatedProduct = await prisma.product.update({
    where: { id: req.body.modifiedProduct.id },
    data: {
      name: req.body.modifiedProduct.name,
      sku: req.body.modifiedProduct.sku,
      image: req.body.modifiedProduct.image,
      quantity: req.body.modifiedProduct.quantity,
      storeId: req.body.modifiedProduct.storeId,
    }
  })

  res.status(200).json(updatedProduct)
}

async function deleteProduct(req: NextApiRequest,
  res: NextApiResponse<Product>) {
  const deleteProduct = await prisma.product.delete({
    where: { id: req.body.productId }
  })

  res.status(200).json(deleteProduct)
}