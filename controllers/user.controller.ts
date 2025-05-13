import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { IUser } from "../models/interfaces";
import User from "../models/user.model";
import { createSecretToken } from "../utils";

const userSignup = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email, password, role } = req.body;

  const userExists: IUser | null = await User.findOne({ email });

  if (userExists) {
    return res.json({ message: "user already exists" });
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = (await User.create({
    firstName,
    lastName,
    email,
    password: await bcrypt.hash(password, saltRounds),
    role,
  })) as IUser;
  const token: string = createSecretToken({ _id: user._id, role: user.role });
  return res.status(201).json({
    message: "Signup successful!",
    success: true,
    data: {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user: IUser | null = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = createSecretToken({ _id: user._id, role: user.role });

  return res.status(201).json({
    message: "User signed in successfully",
    success: true,
    data: {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userId: user._id,
      },
      token,
    },
  });
};

const getUserReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required" });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);
  end.setUTCHours(23, 59, 59, 999);

  try {
    const result = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({ data: result, success: true }); // e.g., [ { _id: "2025-05-10", count: 3 }, ... ]
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { userSignup, login, getUserReport };
