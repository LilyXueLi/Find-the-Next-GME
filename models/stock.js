const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema ({
    rank : {
        type: Number,
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    previousClose: {
        type: Number,
        required: true
    },
    fiftyDayAverage: {
        type: Number,
        required: true
    },
    averageDailyVolume10Day: {
        type: Number,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    }
})

const Stock = mongoose.model("stock", stockSchema);

module.exports = Stock;