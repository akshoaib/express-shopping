import { Request } from "express";
import mongoose from "mongoose";

export interface ICart {
  user: mongoose.Schema.Types.ObjectId;
  cartItems: CartItem[];
  totalPrice: number;
}

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
}

export interface IUser {
  role: "user" | "admin";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id: string;
}

export interface TypedRequestBody<T> extends Request {
  body: T;
  user?: {
    _id?: string;
  };
}

export interface CartItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  product?: mongoose.Schema.Types.ObjectId;
  price?: number;
}

export interface IProduct {
  name: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
}
// export interface AddressItem {
//   city: string;
//   town: string;
//   completeAddress: string;
// }

export interface IAddress {
  city: string;
  town: string;
  completeAddress: string;
}
