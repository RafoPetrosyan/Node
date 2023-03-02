import { Router } from "express";
import users from "./users";
import countries from "./countries.js";
const router = Router();

router.use('/users', users);
router.use('/countries', countries);

export default router;
