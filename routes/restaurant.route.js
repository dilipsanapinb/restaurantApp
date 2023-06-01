const express = require("express");

const { Restautant } = require("../models/restaurant.models");


const restRoute = express.Router();

restRoute.get("/api/restaurants", async (req, res) => {
  try {
    let restaurants = await Restautant.find();
    res
      .status(200)
      .send({ Message: "All Restaurants List", "Restaurants": restaurants });
  } catch (error) {
    console.log("Error in Getting the all restautant details", error);
    res.status(500).send({ Message: error.Message });
  }
});

restRoute.get("/api/restaurants/:id", async (req, res) => {
    const id=req.params.id
  try {
    let restaurants = await Restautant.findOne({'_id':id});
    res
      .status(200)
      .send({ "Message": "Restaurants By ID", "Restaurant": restaurants });
  } catch (error) {
    console.log("Error in Getting the single restautant details", error);
    res.status(500).send({ Message: error.Message });
  }
});

restRoute.get("/api/restaurants/:id/menu", async (req, res) => {
  const id = req.params.id;
  try {
    let restaurants = await Restautant.findOne({ _id: id });
    res
      .status(200)
      .send({ Message: "Restaurants By ID", "Restaurant-Menu": restaurants.menu });
  } catch (error) {
    console.log("Error in Getting the single restautant details", error);
    res.status(500).send({ Message: error.Message });
  }
});

restRoute.post("/api/restaurants", async (req, res) => {
  let { name, address, menu } = req.body;
  try {
    let restaurant = new Restautant({ name, address, menu });
    await restaurant.save();
    res
      .status(200)
      .send({
        Messsage: "New Restaurant added successfully",
        Restaurant: restaurant,
      });
  } catch (error) {
    console.log("Error in Adding The Restaurant", error);
    res.status(500).send({ Message: error.Message });
  }
});

restRoute.post("/api/restaurants/:id/menu",async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    try {
        let restaurant = await Restautant.findById({ "_id": id });
        if (!restaurant) {
            return res.status(404).send({ Message: "restaurant not found" });
        }
        restaurant.menu.push({ name, description, price, image });
        await restaurant.save();
        res.status(200).send({"Message":"Menu Added Succeesfully","Restaurant":restaurant})

    } catch (error) {
        console.log("Error in Adding menu at restaurant", error);
        res.status(500).send({ "Message": error.Message });
    }
    
});

restRoute.delete("/api/restaurants/:id/menu/:menuId", async (req, res) => {
    let { id, menuId } = req.params;
    try {
        let restaurant = await Restautant.findById(id);
        if (!restaurant) {
          return res.status(404).send({ Message: "restaurant not found" });
        }
        const menuIndex = restaurant.menu.findIndex(item => item._id.toString()=== menuId);
        if (menuIndex == -1) {
            return res.status(404).send({ "Message": "Menu not found" });
        }
        restaurant.menu.splice(menuIndex, 1);
        await restaurant.save();
        res.status(202).send({ "Message": "Menu deleted Successfully" ,"Restaurant":restaurant});
    } catch (error) {
        console.log("Error in Deleting menu of restaurant", error);
        res.status(500).send({ "Message": error.Message });
    }
});



module.exports={restRoute}
