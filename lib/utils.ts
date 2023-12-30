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