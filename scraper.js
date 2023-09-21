import puppeteer from "puppeteer";
import fs from "fs";
import axios from "axios";
import { formatData } from "./formatData.js";

const scrape = async (resultFileName, url) => {
  const browser = await puppeteer.launch({ headless: true}); // Launch a new browser instance
  const page = await browser.newPage(); // Open a new page
  // const url = "https://frugalflyer.ca/compare-credit-cards/";
  await page.goto(url); // Navigate to the URL
  // await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.setDefaultNavigationTimeout(0);

  const wrapper = await page.$(".wpgb-viewport");
  const articles = await wrapper.$$("article");

  const result = await Promise.all(
    articles.map(async (article) => {
      const h2CardName = await article.$(".wpgb-block-1");
      const aCardName = await h2CardName.$$("a");
      const cardName = await aCardName[0].evaluate((node) => node.innerText);


      const pCardReward = await article.$(".wpgb-block-2");
      const cardReward = await pCardReward.evaluate((node) => node.innerText);


      const divThumbnail = await article.$(".wpgb-card-media-thumbnail");
      const aImage = await divThumbnail.$("a");
      // Get the image URL from the href attribute of the <a> tag
      const imgLink = await aImage.evaluate((node) =>
        node.getAttribute("href")
      );

      // Download the image and save it as cardName-image.png
      const formattedCardName = formatString(cardName)
      const imgName = `${formattedCardName}-image.png`;
      await downloadImage(imgLink, `./images/${imgName}`);

      return { cardName, cardReward, cardImage: imgName };
    }),
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
    },
  );

  await browser.close(); // Close the browser instance
};
// Function to download an image and save it
const downloadImage = async (imgUrl, imgName) => {
  const response = await axios.get(imgUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(imgName);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

function formatString(str) {
  // Remove non-alphanumeric characters and spaces
  const formattedStr = str.replace(/[^a-zA-Z0-9\s]/g, "");
  // Replace spaces with dashes
  const finalStr = formattedStr.replace(/\s+/g, "-");
  return finalStr;
}

scrape("cad-result", "https://frugalflyer.ca/compare-credit-cards/").then(() =>
  formatData("cad-result")
);
// scrape("us-result", "https://frugalflyer.ca/compare-us-credit-cards/").then(
//   () => formatData("us-result")
// );
