var mongoose = require("mongoose");

var counterSchema = new mongoose.Schema({
    counter: {type: Number, default: 0},
    name: {type: String, default: "counter"}
})

module.exports = mongoose.model("Counter", counterSchema)


