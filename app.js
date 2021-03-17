if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



// console.log(process.env.SECRET);

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
  // console.log("starts");
  // console.log(typeof(latest));
  // console.log(latest[0].timeStamp);
  const latestTimeStamp = latest[0].timeStamp;
  const stockList  = await Stock.find({timeStamp: latestTimeStamp}).exec();
  const stockList = await Stock.find({});
  console.log(stockList);

  let obj = {};
  for (let i=0; i<stockList.length; i++) {
    obj["stock"+i] = stockList[i].ticker;
    obj["name"+i] = stockList[i].name;
    obj["industry"+i] = stockList[i].industry;
    obj["count"+i] = stockList[i].count;
    obj["previousClose"+i] = stockList[i].previousClose;
    obj["fiftyDayAverage"+i] = stockList[i].fiftyDayAverage;
    obj["averageDailyVolume10Day"+i] = stockList[i].averageDailyVolume10Day;
  }
  console.log(obj);
  res.render("index", obj);

})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}!`)
})