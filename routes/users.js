import { Router } from "express";
import UsersController from "../controllers/UsersController";
import upload from "../middlewares/upload.js";
const router = Router();

router.post('/login', UsersController.login)
router.post(
    '/register',
    upload(['image/pnh', 'image/jpeg', 'application/octet-stream']).single('avatar'),
    UsersController.register
)
router.get('/', UsersController.usersList)
router.get('/profile', UsersController.profile)
router.delete('/profile', UsersController.deleteUser)
router.put('/profile', UsersController.updateUser)

export default router;
