import express from 'express';
import {
    postJob,
    getAllJobs,
    getRecruiterJobs,
    getJobById
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route("/post/job").post(isAuthenticated, postJob)
router.route("/get").get(isAuthenticated, getAllJobs)
router.route("/get/recruiter/jobs").get(isAuthenticated,getRecruiterJobs)
router.route("/get/:id").get(isAuthenticated, getJobById)

export { router };