import { Router } from "express";

import Countries from "../controllers/CountriesController.js";


const router = Router();

router.get('/', Countries.list)

export default router;
