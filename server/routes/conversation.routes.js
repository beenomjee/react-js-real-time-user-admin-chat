import { Router } from "express";
import { startConversation } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/index.js";

const router = Router();

router.post("/start", isAuthenticated, startConversation);

export default router;
