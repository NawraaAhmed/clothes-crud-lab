const mongoose = require("mongoose");

// Schema
const clothesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    isItClean: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

// model
const Clothes = mongoose.model("Clothes", clothesSchema);

//export the model
module.exports = Clothes;
