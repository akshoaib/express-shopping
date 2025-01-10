const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
