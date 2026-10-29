// imports
const express = require("express"); //importing express package
const app = express(); // creates a express application
const dotenv = require("dotenv").config(); //this allows me to use my .env values in this file
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const Clothes = require("./models/Clothes");

// Middleware
app.use(express.static("public")); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride("_method"));
app.use(morgan("dev"));

async function conntectToDB() {
  //connection to the database
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error Occured", error);
  }
}

conntectToDB();

// Routes go here
app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

//CRUD

//CREATE
app.get("/clothes/new", (req, res) => {
  res.render("add-clothes.ejs");
});

app.post("/clothes", async (req, res) => {
  req.body.isItClean = req.body.isItClean === "on";
  console.log(req.body);

  //const addedClothes = await Clothes.create(req.body);

  const addedClothes = await Clothes.create({
    type: req.body.type,
    isItClean: req.body.isItClean,
  });
  res.redirect("/"); //Redirect the user to homepage after clothes is added
});

// READ
app.get("/clothes", async (req, res) => {
  const allClothes = await Clothes.find();
  console.log(allClothes);
  res.render("clothes-list.ejs", { clothes: allClothes });
});

app.get("/clothes/:clothesId", async (req, res) => {
  const foundClothes = await Clothes.findById(req.params.clothesId); // Gets the one clothes by its id
  res.render("clothes-details.ejs", { clothes: foundClothes });
});

app.delete("/clothes/:clothesId", async (req, res) => {
  await Clothes.findByIdAndDelete(req.params.clothesId);
  res.redirect("/clothes");
});

app.get("/clothes/:clothesId/edit", async (req, res) => {
  const foundClothes = await Clothes.findById(req.params.clothesId);
  res.render("edit-clothes.ejs", { clothes: foundClothes });
});

app.put("/clothes/:clothesId", async (req, res) => {
  req.body.isItClean = req.body.isItClean === "on"; // converts the isItClean to a Boolean

  const updatedClothes = await Clothes.findByIdAndUpdate(
    req.params.clothesId,
    req.body,
  );

  res.redirect("/clothes");
});

app.listen(3000, () => {
  console.log("Listening on port " + 3000);
}); // Listen on port 3000
