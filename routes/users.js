import { Router } from "express";

import UsersController from "../controllers/UsersController";

const router = Router();

router.post('/login', UsersController.login)

router.post('/register', UsersController.register)
router.get('/profile', UsersController.profile)
router.put('/update', UsersController.updateUser)

router.get('/', UsersController.usersList)


export default router;
