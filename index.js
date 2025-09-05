const puppeteerExtra = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");
puppeteerExtra.use(Stealth());

module.exports.getWebsiteData = async (req, res) => {
  try {
    const url = req.body?.url || req.query?.url;
    if (!url) return res.status(400).json({ error: "Missing 'url'" });

    const browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const data = await page.evaluate(() => {
      const title = document.querySelector("title")?.innerText?.trim() || "";
      const description = document.querySelector("meta[name='description']")?.content?.trim() || "";

      const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.innerText.trim()
      }));

      const paragraphs = [...document.querySelectorAll("p")]
        .map(el => el.innerText.trim())
        .filter(Boolean);

      const links = [...document.querySelectorAll("a[href]")].map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute("href")
      }));

      const fullText = document.body.innerText?.trim() || "";

      return {
        title,
        description,
        headings,
        paragraphs,
        links,
        fullText
      };
    });

    await browser.close();
    res.json({ ok: true, url, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
};
