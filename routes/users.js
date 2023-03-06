import { Router } from "express";
import UsersController from "../controllers/UsersController";
const router = Router();

router.post('/login', UsersController.login)
router.post('/register', UsersController.register)

router.get('/', UsersController.usersList)
router.get('/profile', UsersController.profile)
router.delete('/profile', UsersController.deleteUser)
router.put('/profile', UsersController.updateUser)

export default router;
