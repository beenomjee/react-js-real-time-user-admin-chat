import { Router } from "express";
import {
  getAllUsers,
  signInController,
  signUpController,
} from "../controllers/index.js";
import { isAdmin } from "../middlewares/index.js";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.get("/", isAdmin, getAllUsers);

export default router;
