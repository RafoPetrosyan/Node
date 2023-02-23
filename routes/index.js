import { Router } from "express";
import users from "./users";
import MainController from "../controllers/MainController";
const router = Router();

router.get('/', MainController.main);
router.use('/users', users);

export default router;
