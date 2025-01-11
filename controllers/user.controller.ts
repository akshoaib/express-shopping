import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../models/interfaces";
import User from "../models/user.model";
import { createSecretToken } from "../utils";

const userSignup = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body);
  const userExists: IUser | null = await User.findOne({ email });
  console.log({ userExists });

  if (userExists) {
    return res.json({ message: "user already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = (await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  })) as IUser;
  const token: string = createSecretToken({ _id: user._id, role: user.role });
  return res.status(201).json({
    message: "User signed in successfully",
    success: true,
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user: IUser | null = await User.findOne({ email });
  console.log("ffound::", user);

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);

  console.log({ isMatch });

  if (!isMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = createSecretToken({ _id: user._id, role: user.role });
  return res.status(201).json({
    message: "User signed in successfully",
    success: true,
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
};

export { userSignup, login };
