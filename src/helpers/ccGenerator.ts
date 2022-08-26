const ncp = require('copy-paste')
import Adblocker from 'puppeteer-extra-plugin-adblocker'
import puppeteer from 'puppeteer-extra'

//sleep functin
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const ccScraper = async (bin: string) => {
  console.log('Launching Browser Scraper...')

  puppeteer.use(Adblocker({ blockTrackers: true }))

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto('https://namso-gen.com', { waitUntil: 'networkidle2' })
  const _input = await page.$x(
    '//*[@id="main"]/div/div/div[3]/div[1]/form/div[1]/label/input'
  )
  // await _input[0].click({
  //   button: 'left',
  // })

  await _input[0].type(bin)
  await page.click('button[type="submit"]')

  await page.click(
    '#main > div > div > div.flex.flex-wrap.-mx-2.mt-5.text-gray-700 > div:nth-child(2) > div > label > button'
  )

  await page.screenshot({ path: 'example.png' })
  const cc: string = ncp.paste()

  await sleep(1 * 1000)
  await browser.close()

  return cc
}

export default ccScraper
