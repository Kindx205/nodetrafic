const puppeteer = require("puppeteer");

const urls = [
  "https://example.com/article1",
  "https://example.com/article2",
  "https://example.com/article3"
];

const bots = 55; // Number of bots per site

async function visitSite(url) {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Set to false if you want to see it working
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled"
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    console.log(`Bot visiting: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2" });

    // Randomly stay for 1-4 minutes
    const stayTime = Math.floor(Math.random() * (240000 - 60000) + 60000);
    console.log(`Staying for ${stayTime / 1000} seconds...`);
    await page.waitForTimeout(stayTime);

    // Random scrolling
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight / 2);
      });
      await page.waitForTimeout(3000);
    }

    await browser.close();
    console.log(`Visit completed: ${url}`);
  } catch (error) {
    console.error(`Error visiting ${url}:`, error);
  }
}

// Launch 55 bots per site (165 total)
urls.forEach((url) => {
  for (let i = 0; i < bots; i++) {
    visitSite(url);
  }
});
