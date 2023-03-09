import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModal from "../models/userModal";
import bcrypt from "bcrypt";

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
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const passwordConfirmRaw = req.body.passwordConfirm;

  try {
    if (!username || !email || !passwordRaw || !passwordConfirmRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModal.findOne({ username: username });

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please Choose a different one or log in  instead"
      );
    }

    const existingEmail = await UserModal.findOne({ email: email });

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

    const newUser = await UserModal.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
