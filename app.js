if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Adds all dependencies
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// Loads the schema
const Stock = require("./models/stock");
const Count = require("./models/visitorCount");

// Connects to MongoDB
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log("MONGO CONNECTION OPEN")
  })
  .catch(err => {
    console.error("MONGO CONNECTION ERROR:", err)
  })

// Sets up server
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Gets the latest visitor count, increments it and updates it in the DB
async function updateVisitorCount() {
  const latestCount = await Count.find().sort({ _id: -1 }).limit(1);
  const visitorCount = latestCount[0].count + 1;
  const filter = { count: visitorCount - 1 };
  const update = { count: visitorCount };
  await Count.findOneAndUpdate(filter, update, { upsert: true, sort: { created: -1 } });

  return visitorCount;
}

// Gets the most recent list of Top 10 stocks
async function getLatestStockList() {
  const latest = await Stock.find().sort({ timeStamp: -1 }).limit(1);
  const latestTimeStamp = latest[0].timeStamp;
  const stockList = await Stock.find({ timeStamp: latestTimeStamp }).exec();

  return stockList;
}

// Pulls together a list of stock ranking changes
function getRankingChanges(stockList) {
  let rankingChanges = [];

  for (let i = 0; i < stockList.length; i++) {
    rankingChanges.push({ "ticker": stockList[i].ticker, "newOccur": stockList[i].newOccur, "change": stockList[i].rankingChange });
  }

  return rankingChanges;
}

function rendorData(res, stockList, visitorCount) {
  let obj = {};

  for (let i = 0; i < stockList.length; i++) {
    obj["stock" + i] = stockList[i].ticker;
    obj["name" + i] = stockList[i].name;
    obj["industry" + i] = stockList[i].industry;
    obj["count" + i] = stockList[i].count;
    obj["previousClose" + i] = stockList[i].previousClose;
    obj["fiftyDayAverage" + i] = stockList[i].fiftyDayAverage;
    obj["averageDailyVolume10Day" + i] = stockList[i].averageDailyVolume10Day;
  }
  obj["rankingChanges"] = getRankingChanges(stockList);
  obj["visitorCount"] = visitorCount;

  res.render("index", obj);
}

// Renders the Top 10 stock information to the index page
app.get("/", async (req, res) => {
  let visitorCount = updateVisitorCount();
  let latestStockList = getLatestStockList();

  let values = await Promise.all([latestStockList, visitorCount]);

  rendorData(res, values[0], values[1]);
})

// Checks if the port is open
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}!`)
})