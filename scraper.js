const puppeteer = require('puppeteer')
const svgParser = require('svg-parser').parse

async function scrape(userName) {
  try {
    const urlStructure = `https://github.com/users/${userName}/contributions`
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(urlStructure)

    const rectLength = (await page.$$('rect')).length

    const test = await page.evaluate(el => el.innerHTML, await page.$('.js-calendar-graph'))
    /*
    const parsed = svgParser(test).children[0].children[0].children[0]
    console.log(JSON.stringify(parsed))

    const parsed1 = svgParser(test).children[0].children[0].children[1]
    console.log(JSON.stringify(parsed1))
    */

    const parsedArray = svgParser(test).children[0].children[0].children
    const parsedArrayLength = parsedArray.length
    console.log(parsedArrayLength, JSON.stringify(parsedArray[52]))
    await browser.close()
  } catch (e) {
    console.error(e)
  }
}
scrape('theDavidBarton')

module.exports.scrape = scrape
