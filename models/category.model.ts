import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  name: string;
}

const categorySchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
