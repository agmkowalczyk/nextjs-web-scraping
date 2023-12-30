'use server'

import { revalidatePath } from 'next/cache'
import Product from '../models/product.model'
import { connectToDB } from '../mongoose'
import { scrapeAmazonProduct } from '../scraper'
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils'

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return

  try {
    connectToDB()

    const scrapedProduct = await scrapeAmazonProduct(productUrl)

    if (!scrapedProduct) return

    let product = scrapedProduct

    const existingProduct = await Product.findOne({ url: scrapedProduct.url })

    if (existingProduct) {
      const updatedProductHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedProductHistory,
        lowestPrice: getLowestPrice(updatedProductHistory),
        highestPrice: getHighestPrice(updatedProductHistory),
        averagePrice: getAveragePrice(updatedProductHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    )

    revalidatePath(`/products/${newProduct._id}`)
  } catch (error: any) {
    throw new Error(`Faild to create/update product: ${error.message}`)
  }
}
