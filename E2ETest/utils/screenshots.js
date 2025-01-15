const path = require('path');

const takeScreenshot = async (page, step) => {
  const screenshotDir = path.join(__dirname, '../screenshots');
  if (!page.isClosed()) {
    await page.screenshot({ path: path.join(screenshotDir, `${step}.png`) });
  }
};

module.exports = { takeScreenshot };