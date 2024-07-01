import express from "express";
import { login, signup } from "./controller.js";
import { ensureUniqueUser } from "../../middlewares/auth.js";

const auth = express.Router();

auth.post("/signup", ensureUniqueUser, signup);

auth.post("/login", login);

export default auth;
