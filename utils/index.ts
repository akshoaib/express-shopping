import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface User {
  _id: string;
  role: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

const createSecretToken = (user: User): string => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY as string, {
    expiresIn: "1h",
  });
};

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(400).json({ message: "No token, Authorization failed" });
    return;
  }
  try {
    console.log("in auth");
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    console.log({ decoded });

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

const adminRoleMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if ((req.user as User).role !== "admin") {
      res.status(400).json({ message: "Authorization failed" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export { createSecretToken, authMiddleware, adminRoleMiddleware };
