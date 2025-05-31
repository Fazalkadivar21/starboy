import Router from "express"
import { greetHandler } from "../controllers/greet.controller.js";

const router = Router();

router.route("/me").get(greetHandler)

export default router