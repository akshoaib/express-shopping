import { Response } from "express";
import { IAddress, TypedRequestBody } from "../models/interfaces";
import Address from "../models/address.model";

const addAddress = async (
  req: TypedRequestBody<IAddress>,
  res: Response
): Promise<Response> => {
  try {
    const { city, town, completeAddress } = req.body;
    const user = req.user?._id;
    const addressExists = await Address.findOne({ user: user });
    console.log({ addressExists });

    if (!addressExists) {
      const newAddress = await Address.create({
        user,
        addressList: [{ city, town, completeAddress }],
      });
      return res.status(201).json({
        data: { message: "Address added successfully", newAddress },
        success: true,
      });
    } else {
      const updatedAddress = await Address.findOneAndUpdate(
        { user },
        {
          $push: { addressList: { city, town, completeAddress } },
        },
        { new: true }
      );
      return res.status(201).json({
        data: { message: "Address added successfully", updatedAddress },
        success: true,
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAddress = async (req: TypedRequestBody<IAddress>, res: Response) => {
  try {
    const user = req.user?._id;
    const address = await Address.findOne({ user });
    if (!address) {
      return res.status(200).json({ success: true, data: { address: [] } });
    }
    return res.status(200).json({ success: true, data: { address } });
  } catch (error) {
    console.log(error);
  }
};

const deleteAddress = async (
  req: TypedRequestBody<IAddress>,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user?._id;
    console.log("params::", req.params);

    const _id = req.params.id;
    console.log({ _id });

    const address = await Address.findOne({ user });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, data: { message: "Address not found" } });
    }
    const deletedAddress = await Address.findOneAndUpdate(
      { user },
      {
        $pull: {
          addressList: { _id },
        },
      }
    );
    return res.status(200).json({
      success: true,
      data: { message: "Address deleted successfully" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addAddress, deleteAddress, getAddress };
