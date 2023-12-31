import { PriceHistoryItem, Product } from '@/types'
import { Notification, THRESHOLD_PERCENTAGE } from './nodemailer'

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text()

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.,]/g, '') // or /[^0-9.]/g

      let firstPrice

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0]
      }

      return (firstPrice || cleanPrice).replace(',', '.')
    }
  }

  return ''
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim()
  return currencyText || ''
}

export function extractDescription($: any) {
  const selectors = [
    '#feature-bullets .a-unordered-list .a-list-item',
    '.a-expander-content p',
  ]

  for (const selector of selectors) {
    const elements = $(selector)
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join('\n')
      return textContent
    }
  }

  return ''
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0]

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i]
    }
  }

  return highestPrice.price
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0]

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i]
    }
  }

  return lowestPrice.price
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0)
  const averagePrice = sumOfPrices / priceList.length || 0

  return averagePrice
}

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory)

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification
  }

  return null
}