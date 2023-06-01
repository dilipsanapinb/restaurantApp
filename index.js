const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");

const { userRoute } = require("./routes/user.route");

const { restRoute } = require("./routes/restaurant.route");

const {auth}=require("./middlewares/authenticate")

const {orderRoute}=require("./routes/order.route")
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Food Delivery App");
});

app.use("/user", userRoute);
app.use("/restaurant",auth, restRoute);
app.use("/order",auth, orderRoute);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log('Connected to Server');
    } catch (error) {
        console.log({"Messsage":error.message});
    }
    console.log(`Server is running on port ${process.env.port}`);
})