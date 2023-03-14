import { Router } from "express";
import CandidatesController from "../controllers/CandidatesController";
const router = Router();

router.get('/', CandidatesController.list)


export default router;
