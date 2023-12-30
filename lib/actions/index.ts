'use server'

import { scrapeAmazonProduct } from "../scraper"

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return

  try {
    const sprapedProduct = await scrapeAmazonProduct(productUrl)

  } catch (error: any) {
    throw new Error(`Faild to create/update product: ${error.message}`)
  }
}