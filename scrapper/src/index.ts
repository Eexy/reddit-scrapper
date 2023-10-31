import puppeteer, { HTTPRequest, Page } from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  page.setRequestInterception(true);
  page.on("request", blockUselessNetworkRequest);

  await page.goto("https://old.reddit.com/r/programming", {
    waitUntil: "domcontentloaded",
  });

  const posts = await extractPostsFromPage(page);
  console.info(posts);

  await browser.close();
}

function blockUselessNetworkRequest(req: HTTPRequest) {
  // block script, css, images
  if (req.url().endsWith(".js") || req.url().endsWith(".json")) {
    req.abort();
  } else if (
    req.url().endsWith(".png") ||
    req.url().endsWith(".jpg") ||
    req.url().endsWith(".gif")
  ) {
    req.abort();
  } else if (req.url().endsWith(".css")) {
    req.abort();
  } else {
    req.continue();
  }
}

async function extractPostsFromPage(page: Page) {
  return await page.$$eval(".thing[data-promoted=false]", (things) => {
    return things.map((thing) => {
      return {
        id: thing.getAttribute("id"),
        author: thing.getAttribute("data-author"),
        subreddit: thing.getAttribute("data-subreddit"),
        link: thing.getAttribute("data-permalink"),
        createdAt: new Date(
          Number(thing.getAttribute("data-timestamp"))
        ).toISOString(),
      };
    });
  });
}

main().then(() => console.info("end"));
