import { Router } from "express";
import users from "./users";
import countries from "./countries.js";
import people from "./people.js";
import candidates from "./candidates.js";
const router = Router();

router.get('/', (req, res, next) => {
    res.json({status: 'ok'});
})

router.use('/users', users);
router.use('/countries', countries);
router.use('/people', people);
router.use('/candidates', candidates);

export default router;
