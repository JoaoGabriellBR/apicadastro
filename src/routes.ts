import { Router } from "express";
import User from "./modules/user";

const routes = Router();
const { decodeUserToken } = require("./middlewares");

routes.get("/user", User.getMe);
routes.post("/user", User.createUser);
routes.patch("/user/:id", decodeUserToken, User.updateUser);
routes.patch("/delete-user/:id", decodeUserToken, User.deleteUser);

export default routes;
