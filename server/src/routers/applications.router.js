import express from 'express';
import {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.route("/apply/job/:id").post(isAuthenticated, applyJob)
router.route("/get/applied/job").get(isAuthenticated, getAppliedJobs)
router.route("/get/applicants/:id").get(isAuthenticated, getApplicants)
router.route("/update/status/:id").put(isAuthenticated, updateStatus)

export { router };