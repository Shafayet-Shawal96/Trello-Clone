"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModal_1 = __importDefault(require("../models/userModal"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, validateEnv_1.default.JWT_SECRET, {
        expiresIn: validateEnv_1.default.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, id, statusCode, res) => {
    const token = signToken(id);
    const cookieOptions = {
        expires: new Date(Date.now() + +validateEnv_1.default.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (validateEnv_1.default.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        cookieOptions: cookieOptions,
        data: {
            user: user,
        },
    });
};
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const passwordConfirmRaw = req.body.passwordConfirm;
    try {
        if (!username || !email || !passwordRaw || !passwordConfirmRaw) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const existingUsername = yield userModal_1.default.findOne({ username: username });
        if (existingUsername) {
            throw (0, http_errors_1.default)(409, "Username already taken. Please Choose a different one or log in  instead");
        }
        const existingEmail = yield userModal_1.default.findOne({ email: email });
        if (existingEmail) {
            throw (0, http_errors_1.default)(409, "A user with this email address already exists. Please log in instead.");
        }
        if (passwordRaw != passwordConfirmRaw) {
            throw (0, http_errors_1.default)(409, "password and Confirm password doesn not match");
        }
        const passwordHashed = yield bcrypt_1.default.hash(passwordRaw, 10);
        const newUser = yield userModal_1.default.create({
            username: username,
            email: email,
            password: passwordHashed,
        });
        createSendToken(newUser, newUser._id, 201, res);
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email || !password) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const user = yield userModal_1.default.findOne({ email: email }).select("+password +email");
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        createSendToken(user, user._id, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
