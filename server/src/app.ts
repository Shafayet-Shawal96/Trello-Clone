import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createHttpError, { isHttpError } from "http-errors";

import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/helloworld", (req, res) => {
  console.log(`cokkie ${req.cookies.jwt}`);
  res.status(200).json({ msg: "Hello World " });
});

app.use("/api/v1/users", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response) => {
  console.error(error);
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;