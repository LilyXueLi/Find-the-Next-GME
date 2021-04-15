if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);
iabc
const express = require("express");
const app = express();
const path = require ("path");
const mongoose = require("mongoose");

const Stock = require("./models/stock");

const dbUrl = process.env.DB_URL;
console.log(dbUrl);
//'mongodb://127.0.0.1:27017/fnGME'
mongoose.connect(dbUrl, { useNewUrlParser: true }, { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!! ")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!")
        console.log(err)
    })

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(express.urlencoded ({extended:true}));
app.use(express.static(__dirname));


app.get("/", async (req, res) => {
  const latest = await Stock.find().sort({timeStamp:-1}).limit(1);
  const latestTimeStamp = latest[0].timeStamp;
  const stockList  = await Stock.find({timeStamp: latestTimeStamp}).exec();
  const prev = await Stock.find({timeStamp: {$lte: latestTimeStamp - 2*60*60*1000}}).sort({timeStamp:-1}).limit(1);

  console.log(`latest time: ${latestTimeStamp}`);
  const prevTimeStamp = prev[0].timeStamp;

  console.log(`prev time: ${prevTimeStamp}`);

  const prevStockList = await Stock.find({timeStamp: prevTimeStamp}).exec();

  
  console.log(prevStockList);

  let obj = {};
  for (let i=0; i<stockList.length; i++) {
    obj["stock"+i] = stockList[i].ticker;
    obj["name"+i] = stockList[i].name;
    obj["industry"+i] = stockList[i].industry;
    obj["count"+i] = stockList[i].count;
    obj["previousClose"+i] = stockList[i].previousClose;
    obj["fiftyDayAverage"+i] = stockList[i].fiftyDayAverage;
    obj["averageDailyVolume10Day"+i] = stockList[i].averageDailyVolume10Day;

    // obj["rankingChange"+i] =  
  }

  obj["rankingChange0"] = 0;
  obj["rankingChange1"] = -1;
  obj["rankingChange2"] = 0;

  res.render("index", obj);

})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}!`)
})
