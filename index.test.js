jest.setTimeout(30000)

const githubStreakScraper = require('./index')

/* example:
{
  user: 'theDavidBarton',
  currentlyOnStreak: true,
  currentStreakCount: 123,
  currentStreakStartDate: '2019-12-30'
}
*/

describe('puppeteer scraping', function () {
  test('should return expected object', async function () {
    const response = await githubStreakScraper('theDavidBarton')
    expect(response).toBeTruthy()
    expect(response.user).toBe('theDavidBarton')
    expect(response.currentlyOnStreak).toBeDefined()
    expect(typeof response.currentStreakCount).toBe('number')
    expect(response.currentStreakStartDate).not.toBe(undefined)
    expect(response.jonBonJovi).toBeFalsy()
  })
})
