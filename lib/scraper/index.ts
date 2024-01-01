import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice } from '../utils'

export async function scrapeAmazonProduct(url: string) {
  if (!url) return

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME)
  const password = String(process.env.BRIGHT_DATA_PASSWORD)
  const port = 22225
  const sessionId = 1000000 * Math.random() || 0

  const options = {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    const response = await axios.get(url, options)
    const $ = cheerio.load(response.data)

    const title = $('#productTitle').text().trim()
    const category = $('#nav-subnav').attr('data-category')

    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('a.button-selected .a-color-base')
    )

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base-.a-color-price')
    )

    const stockSpan = $('#availability span').text().trim().toLowerCase()
    const inStock = stockSpan.includes('dostępn')

    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}'
    const imageUrls = Object.keys(JSON.parse(images))

    const currency = extractCurrency($('.priceToPay .a-price-symbol'))
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '')
    const description = extractDescription($)
    const reviews = extractPrice(
      $('#averageCustomerReviews_feature_div #acrCustomerReviewText')
    )
    const stars = $('.a-icon-star .a-icon-alt').text().trim().charAt(0)

    const data = {
      url,
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      isOutOfStock: !inStock,
      image: imageUrls[0],
      currency: currency || 'zł',
      discountRate: Number(discountRate),
      category: category || 'category',
      reviewsCount: Number(reviews) || 100,
      stars: Number(stars) || 4.5,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    return data
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`)
  }
}
