import { Router } from "express";
import users from "./users";
import countries from "./countries.js";
import MainController from "../controllers/MainController";
const router = Router();

router.get('/', MainController.main);
router.use('/users', users);
router.use('/countries', countries);

export default router;
