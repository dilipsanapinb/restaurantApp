const mongoose = require("mongoose");

const restSchema = mongoose.Schema({
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    menu: [{
        name: String,
        description: String,
        price: Number,
        image: String
    }]
});

const Restautant = mongoose.model("Restaurant", restSchema);

module.exports = { Restautant };
