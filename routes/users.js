import { Router } from "express";

import UsersController from "../controllers/UsersController";

const router = Router();

router.post('/login', UsersController.login)

router.post('/register', UsersController.register)
router.get('/profile', UsersController.profile)

router.get('/', UsersController.usersList)
router.get('/logout', UsersController.logOut)


export default router;
