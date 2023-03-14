import { Router } from "express";
import PeopleController from "../controllers/PeopleController";
const router = Router();

router.post('/passport-check', PeopleController.passportCheck);

export default router;
