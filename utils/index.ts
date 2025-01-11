import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import multer from "multer";
import path from "path";

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
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    req.user = decoded;
    next();
  } catch (error) {
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
    res.status(500).json({ message: (error as Error).message });
  }
};
const storage: multer.StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    cb(null, "uploads"); // Specify folder where images should be saved
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    // Define file name using original name and adding timestamp to avoid duplicates
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create Multer upload instance
const uploadImage: multer.Multer = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void => {
    // Only accept image files (jpg, jpeg, png, gif)
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images are allowed"));
    }
  },
});

export { createSecretToken, authMiddleware, adminRoleMiddleware, uploadImage };
