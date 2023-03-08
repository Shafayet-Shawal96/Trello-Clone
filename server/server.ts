import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use((req, res) => {
  res.status(200).json({ msg: "Hello World " });
});

app.listen(5000, () => {
  console.log("Server running on port: " + 5000);
});

export default app;
