import { Router } from "express";

import UsersController from "../controllers/UsersController";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get('/login', UsersController.login)
router.post('/login', UsersController.loginPost)

router.get('/register', UsersController.register)
router.post('/register', UsersController.registerPost)

router.get('/', UsersController.usersList)
router.get('/logout', UsersController.logOut)


export default router;
