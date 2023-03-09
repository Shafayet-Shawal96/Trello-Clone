"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_errors_1 = require("http-errors");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
let originString = "http://localhost:3000";
if (validateEnv_1.default.NODE_ENV === "production")
    originString = "https://trello-clone-three-alpha.vercel.app";
app.use((0, cors_1.default)({ origin: originString, credentials: true }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/helloworld", (req, res) => {
    console.log(`cokkie ${req.cookies.jwt}`);
    let message = "Hello World ";
    if (req.cookies.jwt)
        message = "Cookie found";
    res.status(200).json({ msg: message });
});
app.use("/api/v1/users", userRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({ msg: "Endpoint not found" });
    // next(createHttpError(404, "Endpoint not found"));
});
app.use((error, req, res) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
