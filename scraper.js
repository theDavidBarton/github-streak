const puppeteer = require('puppeteer')
const svgParser = require('svg-parser').parse

async function scrape(userName) {
  try {
    const githubContributionGrpah = `https://github.com/users/${userName}/contributions`
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(githubContributionGrpah)

    const calendarSvg = await page.evaluate(el => el.innerHTML, await page.$('.js-calendar-graph'))
    const parsedCalendarArray = svgParser(calendarSvg).children[0].children[0].children

    const streakCounter = () => {
      let currentStreakCount = 0
      let currentlyOnStreak = true

      outer: for (let i = parsedCalendarArray.length - 1; i >= 0; i--) {
        if (parsedCalendarArray[i].tagName === 'g') {
          const currentWeekLength = parsedCalendarArray[i].children.length
          let currentIndex = i

          inner: for (let j = currentWeekLength - 1; j >= 0; j--) {
            // today is allowed to be unfinished, it is still considered a streak
            if (
              parsedCalendarArray[i].children[j].properties['data-count'] > 0 ||
              (currentIndex === i && j === currentWeekLength - 1)
            ) {
              console.log(
                `${i}.${j}`,
                parsedCalendarArray[i].children[j].properties['data-date'],
                parsedCalendarArray[i].children[j].properties['data-count']
              )
              parsedCalendarArray[i].children[j].properties['data-count'] > 0
                ? currentStreakCount++
                : console.log('today is unfinished!')
              console.log(currentlyOnStreak)
              continue inner
            } else {
              currentlyOnStreak = false
              console.log(
                `${i}.${j}`,
                parsedCalendarArray[i].children[j].properties['data-date'],
                parsedCalendarArray[i].children[j].properties['data-count']
              )
              console.log(currentlyOnStreak)
              break outer
            }
          }
        }
      }
      const streak = {
        currentlyOnStreak: currentlyOnStreak,
        currentStreakCount: currentStreakCount
      }
      return streak
    }
    const testStreakObj = streakCounter()
    console.log(testStreakObj)

    // console.log(parsedArrayLength, JSON.stringify(parsedArray[52]))
    await browser.close()
  } catch (e) {
    console.error(e)
  }
}
scrape('theDavidBarton')

module.exports.scrape = scrape
