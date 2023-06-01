const express = require("express");

const { Order } = require("../models/order.model");

const orderRoute = express.Router();

orderRoute.post("/api/order", async (req, res) => {
    let { user, restaurant, items, totalPrice, deliveryAddress, status } = req.body;
    try {
        let order = new Order({
            user,
            restaurant,
            items,
            totalPrice,
            deliveryAddress,
            status,
        });
        order = await order.populate("user", "-password");
        order = await order.populate("restaurant", "name address");
        await order.save()
        res.status(201).send({ "Message": "Order Added Successfully", "Order": order })
    } catch (error) {
        console.log("Error in Order the food", error);
        res.status(500).send({ "Message": error.Message });
    }
});

orderRoute.get("/api/orders",async(req,res)=>{
    try {
        let orders = await Order.find()
          .populate("user", "-password")
          .populate("restaurant", "name address");
        res.status(200).send({"Message":"All Orders data", "Orders":orders})
    } catch (error) {
         console.log("Error in Getting All Orders", error);
         res.status(500).send({ "Message": error.Message });
    }
})

// by id
orderRoute.get("/api/orders/:id", async (req, res) => {
    let { id } = req.params;
  try {
    let orders = await Order.findById(id)
      .populate("user", "-password")
      .populate("restaurant", "name address");
    res.status(200).send({ Message: " Order By Id data", "Order": orders });
  } catch (error) {
    console.log("Error in Getting Single Order", error);
    res.status(500).send({ "Message": error.Message });
  }
});

orderRoute.put("/api/orders/:id", async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;

    try {
        let order = await Order.findById(id);
        if (!order) {
            return res.status(404).send({"Message":"Order Not found"})
        }
        order.status = status;
        await order.save();
        res.status(200).send({
            "Message":"Order Status Updated Successfully","Order":order
        })
    } catch (error) {
        console.log("Error in Updating the status of order", error);
        res.status(500).send({ Message: error.Message });
    }


});
module.exports={orderRoute}

