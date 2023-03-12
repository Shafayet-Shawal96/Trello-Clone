import { RequestHandler, Response } from "express";
import { CookieOptions } from "express";
import { promisify } from "util";
import createHttpError from "http-errors";
import UserModel, { User } from "../models/userModel";
import env from "../utils/validateEnv";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const signToken = (id: mongoose.Types.ObjectId) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: User,
  id: mongoose.Types.ObjectId,
  statusCode: number,
  res: Response
) => {
  const token = signToken(id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + +env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  if (env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json(user);
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export const signup: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const passwordConfirmRaw = req.body.passwordConfirm;

  try {
    if (!username || !email || !passwordRaw || !passwordConfirmRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModel.findOne({ username: username });

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please Choose a different one or log in  instead"
      );
    }

    const existingEmail = await UserModel.findOne({ email: email });

    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exists. Please log in instead."
      );
    }

    if (passwordRaw != passwordConfirmRaw) {
      throw createHttpError(
        409,
        "password and Confirm password doesn not match"
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    createSendToken(newUser, newUser._id, 201, res);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ email: email }).select(
      "+password +email"
    );

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }
    createSendToken(user, user._id, 200, res);
  } catch (error) {
    next(error);
  }
};

// Only for rendered pages, no errors!
export const isLoggedIn: RequestHandler = async (req, res) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = jwt.verify(req.cookies.jwt, env.JWT_SECRET) as JwtPayload;

      const user = await UserModel.findById(decoded.id).select("+email");
      res.status(200).json(user);
    } catch (error) {
      res.status(200).json(error);
    }
  } else {
    res.status(404).json({ msg: "No User" });
  }
};
