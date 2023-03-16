import { Router } from "express";
import PeopleController from "../controllers/PeopleController";
const router = Router();

router.post('/passport-check', PeopleController.passportCheck);
router.post('/vote', PeopleController.vote);

export default router;
