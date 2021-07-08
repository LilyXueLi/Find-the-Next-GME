if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Stock = require("./models/stock");
const Count = require("./models/visitorCount");

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log("MONGO CONNECTION OPEN")
  })
  .catch(err => {
    console.error("MONGO CONNECTION ERROR:", err)
  })

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


function getRankingChanges(prevStockList, currStockList) {
  let rankingChanges = [];
  let prevPositions = [];
  let currInPrevPositions = [];

  for (prevStock of prevStockList) {
    prevPositions.push(prevStock["ticker"]);
  }

  for (let i = 0; i < 10; i++) {
    currInPrevPositions.push(prevPositions.indexOf(currStockList[i]["ticker"]) + 1);
  }

  for (let i = 0; i < 10; i++) {
    if (currInPrevPositions[i] == 0) {
      rankingChanges.push({ "ticker": currStockList[i]["ticker"] });
    }
    else {
      rankingChanges.push({ "ticker": currStockList[i]["ticker"], "change": currStockList[i]["rank"] - currInPrevPositions[i] });
    }

  }
  return rankingChanges;
}

app.get("/", async (req, res) => {
  const latestCount = await Count.find().sort({ _id: -1 }).limit(1);
  const visitorCount = latestCount[0].count + 1;
  const filter = { count: visitorCount - 1 };
  const update = { count: visitorCount };
  let doc = await Count.findOneAndUpdate(filter, update, { upsert: true, sort: { created: -1 } });

  const latest = await Stock.find().sort({ timeStamp: -1 }).limit(1);
  const latestTimeStamp = latest[0].timeStamp;
  const stockList = await Stock.find({ timeStamp: latestTimeStamp }).exec();
  const prev = await Stock.find({ timeStamp: { $lte: latestTimeStamp - 2 * 60 * 60 * 1000 } }).sort({ timeStamp: -1 }).limit(1);
  const prevTimeStamp = prev[0].timeStamp;
  const prevStockList = await Stock.find({ timeStamp: prevTimeStamp }).exec();

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

  obj["rankingChanges"] = getRankingChanges(prevStockList, stockList);

  obj["visitorCount"] = visitorCount;

  res.render("index", obj);
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}!`)
})