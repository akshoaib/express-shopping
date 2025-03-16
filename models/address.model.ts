import mongoose, { Document, Schema } from "mongoose";

interface Address {
  city: mongoose.Schema.Types.ObjectId;
  town: number;
  completeAddress: string;
  _id: string;
}

interface AddressDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  addressList: Address[];
}

const addressSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    addressList: [
      {
        city: {
          type: String,
          required: true,
        },
        town: {
          type: String,
          required: true,
        },
        completeAddress: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model<AddressDocument>("address", addressSchema);

export default Address;
