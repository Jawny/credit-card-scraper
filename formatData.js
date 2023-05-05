import fs from "fs";
const rewards = [
  "None",
  "Amtrak Guest Rewards",
  "Ultimate Rewards",
  "Premium Rewards",
  "MileagePlus",
  "SkyMiles",
  "AAdvantage",
  "Hilton Honors",
  "World of Hyatt",
  "Capital One Rewards",
  "ThankYou Points",
  "Rapid Rewards",
  "Alaska Miles",
  "À la carte Rewards",
  "Best Western Rewards",
  "Marriott Bonvoy",
  "Aventura",
  "Avios",
  "Asia Miles",
  "Cash back",
  "Aeroplan",
  "Avion",
  "Canadian Tire Money",
  "PC Optimum",
  "RBC Rewards",
  "WestJet Dollars",
  "BMO Rewards",
  "TD Rewards",
  "CIBC Rewards",
  "HSBC Rewards",
  "Membership Rewards",
  "Rogers Bank Rewards",
  "MBNA Rewards",
  "Scotia Rewards",
  "Tangerine Rewards",
  "Amazon.ca Rewards",
  "Best Buy Reward Zone",
  "Hudson's Bay Rewards",
  "Indigo Plum Rewards",
  "Sobeys Club",
  "Starbucks Rewards",
  "Walmart Rewards",
  "Triangle Rewards",
  "AIR MILES",
  "Scene+",
];

const containsRewardProgram = (str) => {
  for (let i = 0; i < rewards.length; i++) {
    const formattedStr = str.replace(/\s+/g, "").toLowerCase();
    const formattedReward = rewards[i].replace(/\s+/g, "").toLowerCase();
    if (formattedStr.includes(formattedReward)) {
      return { res: true, reward: rewards[i] };
    }
  }
  return { res: false, reward: null };
};

// add value and label prop
const addValueAndLabel = (fileName) => {
  fs.readFile(`${fileName}.json`, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }

    const parsedData = JSON.parse(data);

    const updatedData = parsedData.map((card) => {
      const { cardName, cardReward } = card;
      return {
        cardName,
        cardReward,
        value: cardName,
        label: cardName,
      };
    });

    fs.writeFile(
      `${fileName}-with-values-labels.json`,
      JSON.stringify(updatedData),
      (err) => {
        if (err) {
          console.log("Error writing file:", err);
        } else {
          console.log("Card object has been updated and saved to file");
        }
      }
    );
  });
};

export const formatData = (fileName) => {
  fs.readFile(`${fileName}.json`, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }

    const cardArray = JSON.parse(data);

    const updatedCards = cardArray.map((card) => {
      const { cardName, cardReward } = card;
      const { res, reward } = containsRewardProgram(cardReward);

      if (res) {
        return { cardName, cardReward: reward };
      } else {
        return { cardName, cardReward: `${cardReward}-UNKNOWN` };
      }
    });

    // Write the updated card object back to the file
    fs.writeFile(`${fileName}.json`, JSON.stringify(updatedCards), (err) => {
      if (err) {
        console.log("Error writing file:", err);
      } else {
        console.log("Card object has been updated and saved to file");
      }
    });
  });

  console.log(`finished formatting ${fileName}`);
};

const combineData = (file1, file2) => {
  // write code that combines the two json files into a single json

  fs.readFile(`${file1}.json`, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }

    const usCardArray = JSON.parse(data);

    fs.readFile(`${file2}.json`, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }

      const cadCardArray = JSON.parse(data);

      const combinedArray = [...usCardArray, ...cadCardArray];

      fs.writeFile(
        "combined-result.json",
        JSON.stringify(combinedArray),
        (err) => {
          if (err) {
            console.log("Error writing file:", err);
          } else {
            console.log("Card object has been updated and saved to file");
          }
        }
      );
    });
  });
};

// uncomment to just run reformatter

// formatData("us-result");
// formatData("cad-result");
combineData("us-result", "cad-result");
// addValueAndLabel("combined-result");
