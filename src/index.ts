import "dotenv/config";
import puppeteer, { HTTPRequest, Page } from "puppeteer";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { Post } from "./types/post";
import { Comment } from "./types/comment";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());

app.get("/", async (req, res) => {
  const { subreddit } = req.query;

  if (typeof subreddit !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid subreddit query params" });
  }

  const parsedSubReddit = subreddit.trim().toLowerCase();

  if (!subreddit.length) {
    return res.status(400).json({ error: "Invalid subreddit name" });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  page.setRequestInterception(true);
  page.on("request", blockUselessNetworkRequest);

  const subredditUrl = `https://old.reddit.com/r/${parsedSubReddit}`;
  await page.goto(subredditUrl, {
    waitUntil: "domcontentloaded",
  });

  const posts = await extractPostsFromPage(page);
  const postsComments = await Promise.all(
    posts.map(async (post) => {
      const postPage = await browser.newPage();
      postPage.setRequestInterception(true);
      postPage.on("request", blockUselessNetworkRequest);

      await postPage.goto(`https://old.reddit.com/${post.link}`, {
        waitUntil: "domcontentloaded",
      });

      const comments = await postPage.$$eval(
        ".nestedlisting > .comment",
        (nodes) => {
          return nodes.map((node) => {
            function extractComment(el: Element): Comment {
              return {
                id: el.getAttribute("id"),
                authorName: el.getAttribute("data-author"),
                authorId: el.getAttribute("data-author-fullname"),
                content:
                  el.querySelector<HTMLElement>(".entry form p")?.innerText,
                comments: [
                  ...el.querySelectorAll(".child > div > .comment"),
                ].map(extractComment),
              };
            }

            return extractComment(node);
          });
        }
      );

      return {
        ...post,
        comments,
      };
    })
  );

  await browser.close();

  return res.json(postsComments);
});

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

async function extractPostsFromPage(page: Page): Promise<Post[]> {
  return await page.$$eval(".thing[data-promoted=false]", (things) => {
    return things.map((thing) => {
      return {
        id: thing.getAttribute("id"),
        authorName: thing.getAttribute("data-author"),
        authorId: thing.getAttribute("data-author-fullname"),
        subredditName: thing.getAttribute("data-subreddit"),
        subredditId: thing.getAttribute("data-subreddit-fullname"),
        link: thing.getAttribute("data-permalink"),
        createdAt: new Date(
          Number(thing.getAttribute("data-timestamp"))
        ).toISOString(),
        title: thing.querySelector<HTMLElement>("a.title")?.innerText || "",
      };
    });
  });
}

app.listen(PORT, () => console.log(`Listening port : ${PORT}`));
