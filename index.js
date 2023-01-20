// @ts-check

const { chromium } = require('playwright')

// tiendas disponibles
const shops = [
  {
    vendor: 'Microsoft',
    hasSchema: false,
    url: 'https://www.xbox.com/es-es/configure/8WJ714N3RBTL',
    // furncion para encontrar si está disponible en la web
    checkStock: async ({ page }) => {
      const content = await page.textContent(
        '[aria-label="Finalizar la compra del pack"]'
      )
      return content?.includes('Sin existencias') === false
    }
  },
  {
    vendor: 'Game',
    hasSchema: false,
    url: 'https://www.game.es/HARDWARE/CONSOLA/XBOX-SERIES-X/XBOX-SERIES-S/182900',
    // furncion para encontrar si está disponible en la web
    checkStock: async ({ page }) => {
      const content = await page.textContent('.product-quick-actions')
      return content.includes('Producto no disponible') === false
    }
  },
  {
    vendor: 'Fnac',
    hasSchema: true,
    url: 'https://www.fnac.es/Consola-Xbox-Series-X-1TB-Negro-Videoconsola-Consola/a7732201',
    // furncion para encontrar si está disponible en la web
    checkStock: async ({ page }) => {
      const notAvailableIcon = await page.$$('.f-buyBox-availabilityStatus-unavailable')
      return notAvailableIcon.length === 0
    }
  }
]

// funcion principal del proyecto
;(async () => {
  const browser = await chromium.launch({ headless: false })

  // vamos a cada tienda del array de tiendas
  for (const shop of shops) {
    const { checkStock, url, vendor } = shop
    const page = await browser.newPage()
    await page.goto(url)
    const hasStock = await checkStock({ page })
    console.log(
      `${vendor}: ${hasStock ? 'HAS STOCK!!!! 🤩' : 'Out of Stock 😢'}`
    )
    await page.screenshot({ path: `screenshots/${vendor}.png` })
    await page.close()
  }

  await browser.close()
})()
