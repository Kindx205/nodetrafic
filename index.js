const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const pluginUserAgentOverride = require("puppeteer-extra-plugin-anonymize-ua");

puppeteer.use(StealthPlugin());
puppeteer.use(pluginUserAgentOverride());

const urls = [
  "https://coderelic.odoo.com/blog/code-relic-a-revolution-2/mastering-core-programming-concepts-8",
  "https://coderelic.odoo.com/blog/code-relic-a-revolution-2/mastering-core-programming-concepts-8",
  "https://coderelic.odoo.com/blog/code-relic-a-revolution-2/mastering-core-programming-concepts-8"
];

const bots = 55; // Number of bots per site

async function humanLikeInteraction(page) {
  await page.waitForTimeout(Math.random() * 2000 + 1000); // Random pause
  for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
    await page.mouse.move(
      Math.random() * 500 + 200,
      Math.random() * 500 + 200,
      { steps: 5 }
    );
    await page.waitForTimeout(Math.random() * 2000 + 1000);
  }
}

async function visitSite(url) {
  try {
    const browser = await puppeteer.launch({
      headless: "new", // Avoid detection
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-gpu",
        "--proxy-bypass-list=*"
      ]
    });

    const page = await browser.newPage();

    // Set randomized user-agent
    await page.setUserAgent(
      `Mozilla/5.0 (Windows NT ${Math.floor(
        Math.random() * 3 + 8
      )}.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
        Math.floor(Math.random() * 30) + 90
      }.0.0.0 Safari/537.36`
    );

    // Set viewport randomly
    await page.setViewport({
      width: Math.floor(Math.random() * 400) + 800,
      height: Math.floor(Math.random() * 200) + 600,
      deviceScaleFactor: 1,
    });

    console.log(`🔵 Bot visiting: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Simulate human behavior
    await humanLikeInteraction(page);

    // Randomly stay for 1-4 minutes
    const stayTime = Math.floor(Math.random() * (240000 - 60000) + 60000);
    console.log(`⏳ Staying for ${stayTime / 1000} seconds...`);
    await page.waitForTimeout(stayTime);

    // Scroll down randomly
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight / 2);
      });
      await page.waitForTimeout(Math.random() * 3000 + 2000);
    }

    await browser.close();
    console.log(`✅ Visit completed: ${url}`);
  } catch (error) {
    console.error(`❌ Error visiting ${url}:`, error);
  }
}

// Launch 55 bots per site (165 total)
urls.forEach((url) => {
  for (let i = 0; i < bots; i++) {
    visitSite(url);
  }
});

