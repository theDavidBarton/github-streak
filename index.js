/*
MIT License

Copyright (c) 2020 David Barton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const puppeteer = require('puppeteer')
const svgParser = require('svg-parser').parse

/*
 * @param {string} userName: (mandatory) exact GitHub user name
 * @return {object} streak: an object with the scraped streak data
 */

const githubStreakScraper = async userName => {
  try {
    const githubContributionGraph = `https://github.com/users/${userName}/contributions`
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(githubContributionGraph)

    const calendarSvg = await page.evaluate(el => el.innerHTML, await page.$('.js-calendar-graph'))
    const calendarArray = svgParser(calendarSvg).children[0].children[0].children
    await browser.close()

    const streakCounter = () => {
      let streak = {}
      let currentStreakCount = 0
      let currentlyOnStreak = false
      let currentStreakStartDate = null

      loopOverWeeks: for (let i = calendarArray.length - 1; i >= 0; i--) {
        if (calendarArray[i].tagName === 'g') {
          const checkedWeekLength = calendarArray[i].children.length
          const checkedWeekIndex = i

          for (let j = checkedWeekLength - 1; j >= 0; j--) {
            const checkedDayProps = calendarArray[i].children[j].properties
            // today is allowed to be unfinished (not-a-full-streak), it is still considered a streak
            if (checkedDayProps['data-count'] > 0 || (checkedWeekIndex === i && j === checkedWeekLength - 1)) {
              if (checkedDayProps['data-count'] > 0) {
                currentStreakCount++
                currentlyOnStreak = true
                currentStreakStartDate = checkedDayProps['data-date']
              }
            } else {
              break loopOverWeeks
            }
          }
        }
      }
      streak = {
        user: userName,
        currentlyOnStreak: currentlyOnStreak,
        currentStreakCount: currentStreakCount,
        currentStreakStartDate: currentStreakStartDate
      }
      return streak
    }

    return streakCounter()
  } catch (e) {
    console.error(e)
  }
}

module.exports = githubStreakScraper
