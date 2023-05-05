import puppeteer from "puppeteer";
import fs from "fs";
import { formatData } from "./formatData.js";

const scrape = async (resultFileName, url) => {
  const browser = await puppeteer.launch({ headless: true }); // Launch a new browser instance
  const page = await browser.newPage(); // Open a new page
  // const url = "https://frugalflyer.ca/compare-credit-cards/";
  await page.goto(url); // Navigate to the URL
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  const wrapper = await page.$(".wpgb-viewport");
  const articles = await wrapper.$$("article");

  const result = await Promise.all(
    articles.map(async (article) => {
      const h2CardName = await article.$(".wpgb-block-1");
      const aCardName = await h2CardName.$$("a");
      const cardName = await aCardName[0].evaluate((node) => node.innerText);

      const pCardReward = await article.$(".wpgb-block-2");
      const cardReward = await pCardReward.evaluate((node) => node.innerText);
      return { cardName, cardReward };
    })
  );

  await fs.writeFile(
    `${resultFileName}.json`,
    JSON.stringify(result),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Result saved to result.json");
    }
  );

  await browser.close(); // Close the browser instance
};

scrape("cad-result", "https://frugalflyer.ca/compare-credit-cards/").then(() =>
  formatData("cad-result")
);
scrape("us-result", "https://frugalflyer.ca/compare-us-credit-cards/").then(
  () => formatData("us-result")
);
