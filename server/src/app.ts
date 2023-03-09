import "dotenv/config";
import express, { Request, Response } from "express";
import env from "./utils/validateEnv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { isHttpError } from "http-errors";

import userRoutes from "./routes/userRoutes";

const app = express();

let originString = "http://localhost:3000";

if (env.NODE_ENV === "production")
  originString = "https://trello-clone-three-alpha.vercel.app";

app.use(cors({ origin: originString, credentials: true }));

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/helloworld", (req, res) => {
  console.log(`cokkie ${req.cookies.jwt}`);
  let message = "Hello World ";
  if (req.cookies.jwt) message = "Cookie found";
  res.status(200).json({ msg: message });
});

app.use("/api/v1/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: "Endpoint not found" });
  // next(createHttpError(404, "Endpoint not found"));
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
