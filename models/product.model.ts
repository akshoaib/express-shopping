import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviews: {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    images: {
      type: [String],
      required: [true, "Please enter at least one image"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be less than 0."],
          max: [4, "Rating cannot exceed 4."],
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
