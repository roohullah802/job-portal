import express from 'express';
import {
    userRegistration,
    userLogin,
    profileUpdate,
    userLogout,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route("/register").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/logout").post(isAuthenticated, userLogout)
router.route("/profile/update").put(isAuthenticated, profileUpdate);

export { router };