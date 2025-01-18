import express from 'express';
import {
    registerRecruiterCompany,
    getRecruiterCompany,
    updateCompany
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.route("/register/recruiter/company").post(isAuthenticated, registerRecruiterCompany)
router.route("/get/recruiter/company/:id").get(isAuthenticated,getRecruiterCompany);
router.route("/update/company/:id").put(isAuthenticated,updateCompany)
export { router };