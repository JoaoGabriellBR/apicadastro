import { Router } from "express";
import decodeUserToken from "./middlewares";
import User from "./modules/user";

const routes = Router();

routes.get("/user", User.getMe);
routes.get("/user/:id", decodeUserToken, User.getUser)
routes.post("/user", User.createUser);
routes.patch("/user/:id", decodeUserToken, User.updateUser);
routes.patch("/user/change-password", decodeUserToken, User.changePassword);
routes.patch("/user/delete/:id", decodeUserToken, User.deleteUser);
routes.post("/login", User.login);

export default routes;
