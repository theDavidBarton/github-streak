# GitHub Streak Scraper

[![npm package](https://img.shields.io/npm/v/github-streak-scraper.svg)](https://www.npmjs.com/package/github-streak-scraper)
[![Dependency Status](https://david-dm.org/theDavidBarton/github-streak.svg)](https://david-dm.org/theDavidBarton/github-streak/)

Parses the Contribution graph to count the current streak of a GitHub user.

## Usage

Wrap `githubStreakScraper('GitHub-user-name')` in an async function/promise.

```js
const getStreakData = async => {
  const githubStreak = await githubStreakScraper('theDavidBarton');
  console.log(githubStreak)
}
```

```js
{
  user: 'theDavidBarton',
  currentlyOnStreak: true,
  currentStreakCount: 18,
  currentStreakStartDate: '2019-12-30'
}
```

## License

MIT License

Copyright (c) 2020 David Barton
