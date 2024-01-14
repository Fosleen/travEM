import { Router } from "express";
const authRouter = new Router();

authRouter.get("/", function (req, res, next) {
  res.render("login"); //gore ide ruta, dole ide to dal se salje
});

export default authRouter;
