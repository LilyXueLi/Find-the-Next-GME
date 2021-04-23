const mongoose = require("mongoose");

const visitorCountSchema = new mongoose.Schema ({
    count : {
        type: Number,
        required: true
    }
})

const Count = mongoose.model("count", visitorCountSchema);

module.exports = Count;
