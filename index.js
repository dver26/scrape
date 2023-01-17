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
  /* // disabled for now because it's not working properly
  {
    vendor: 'MediaMarkt',
    hasSchema: true,
    url: 'https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-s-512-gb-ssd-blanco-1487616.html',
    // furncion para encontrar si está disponible en la web
    checkStock: async ({ page }) => {
      const content = await page.textContent('[data-test="pdp-product-not-available"]')
      return content.includes('no está disponible') === false
    }
  },
  // disabled for now because it's not working properly
  {
    vendor: 'Amazon',
    hasSchema: false,
    url: 'https://www.amazon.es/Microsoft-Xbox-Series-X-Standard/dp/B08JDSW1ZW/ref=asc_df_B08JDSW1ZW/?tag=googshopes-21&linkCode=df0&hvadid=593142465768&hvpos=&hvnetw=g&hvrand=15485825285777940441&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=20294&hvtargid=pla-1043815071114&psc=1',
    // furncion para encontrar si está disponible en la web
    checkStock: async ({ page }) => {
      const addToCartButton = await page.textContent('[id="add-to-cart-button"]')
      return addToCartButton.includes('cesta') === true
    }
  }, */
  /* {
    vendor: 'El Corte Inglés',
    hasSchema: false
    url: 'https://www.elcorteingles.es/videojuegos/A45506578-xbox-series-s-gilded-hunter-bundle/',
    checkStock: async ({ page }) => {}
  } */
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
