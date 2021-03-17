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
    count: {
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