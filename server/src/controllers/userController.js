import { User } from "../models/User.model.js";
import { Company } from "../models/Company.model.js"
import { Job } from "../models/Job.model.js";
import { Application } from "../models/Application.model.js";


// user regisration router
const userRegistration = async (req, res) => {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({
            message: "Something is missing!",
            success: false
        })
    }
    let obj = {
        fullname,
        email,
        phoneNumber,
        password,
        role
    }

    const response = await User.create(obj)
    const newUser = await response.save()

    return res.status(200).json({
        message: "User register succesfully",
        success: true,
        newUser
    })

}




// user login router
const userLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(200).json({
                message: "Something is missing!",
                success: false
            })
        }

        const user = await User.findOne({ email: email })


        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        const isPass = await user.checkPassword(password)

        if (!isPass) {
            return res.status(400).json({
                message: "fullname or password is incorrect!",
                success: false
            })
        }


        if (role !== user.role) {
            return res.status(400).json({
                message: "User not found for the current role",
                success: false
            })
        }

        const token = await user.generateAccessToken()
        if (!token) {
            return res.status(400).json({
                message: "token not generated",
                success: false
            })
        }


        return res.status(200).cookie("token", token).json({
            message: "User logged in",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false,
            error
        })
    }
}



// user logged out router
const userLogout = (req, res) => {
    try {

        return res.status(200).clearCookie("token").json({
            message: "User logged out",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }
}



// user profile update router
// const profileUpdate = async (req, res) => {
//     const { fullname, email, phoneNumber, bio, skills, profilePhoto, resumeOriginalName, resume } = req.body;

//     const user = await User.findById(req.user._id)
//     if (!user) {
//         return res.status(400).json({
//             message: "User not found"
//         })
//     }

//     if (fullname) user.fullname = fullname;
//     if (email) user.email = email;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     if (bio) user.bio = bio;
//     if (skills) user.skills = skills;
//     if (profilePhoto) user.profilePhoto = profilePhoto;
//     if (resumeOriginalName) user.resumeOriginalName = resumeOriginalName;
//     if (resume) user.resume = resume;

//     const updatedData = await user.save()

//     if (!updatedData) {
//         return res.status(400).json({
//             message: "User not updated"
//         })
//     }

//     return res.status(200).json({
//         message: "User updated successfully",
//         updatedData,
//         success: true
//     })
// }

const profileUpdate = async (req, res) => {
    const { fullname, email, phoneNumber, bio, skills, profilePhoto, resumeOriginalName, resume } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.bio = bio;
        if (Array.isArray(skills)) {
            user.profile.skills = skills;
        } else if (skills) {
            return res.status(400).json({ message: "Skills must be an array" });
        }
        if (profilePhoto) user.profilePhoto = profilePhoto;
        if (resumeOriginalName) user.resumeOriginalName = resumeOriginalName;
        if (resume) user.resume = resume;

        const updatedData = await user.save();
        return res.status(200).json({
            message: "User updated successfully",
            updatedData,
            success: true
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};




// register recruiter company router
const registerRecruiterCompany = async (req, res) => {
    const { companyName } = req.body;
    const _id = req.user._id
    const role = req.user.role

    if (role !== "recruiter") {
        return res.status(400).json({
            message: "this role is not allowed for register the company",
            success: false
        })
    }

    if (!companyName) {
        return res.status(400).json({
            message: "Company name is required",
            success: false
        })
    }

    const company = await Company.findOne({ name: companyName });
    if (company) {
        return res.status(400).json({
            message: "You can't register the same name company",
            success: false
        })
    }

    const comp = await Company.create({ name: companyName, userId: _id });
    if (!comp) {
        return res.status(400).json({
            message: "Company not registered, something error!",
            success: false
        })
    }

    const newCompany = await comp.save();

    return res.status(200).json({
        message: "Company registered successfully",
        success: true,
        Company: newCompany
    })

}




// get the recruiter companies
const getRecruiterCompany = async (req, res) => {
    try {
        const id = req.params.id

        const companies = await Company.findById(id)

        if (!companies) {
            return res.status(404).json({
                message: "Company not found!",
                success: false
            })
        }

        return res.status(200).json({
            message: "Countries fetched successfully",
            success: true,
            companies
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }


}




// update company fields
const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo, } = req.body;

        if (!description || !website || !location || !logo) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        const obj = {name, description, website, location, logo }

        const updatedData = await Company.findByIdAndUpdate(req.params.id, obj, { new: true })

        if (!updatedData) {
            return res.status(400).json({
                message: "company not found and updation failed",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company fields updated successfully",
            success: true,
            updatedData
        })
    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }

}




// post the job router
const postJob = async (req, res) => {
    const { title, description, requirements, salary, experienceLevel, location, jobType, position, companyId } = req.body
    const userId = req.user._id

    // Validate that all required fields are present
    if (!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType || !position || !companyId) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        })
    }

    try {
        // Create the job
        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            experienceLevel,
            location,
            jobType,
            position,
            created_by: userId,
            company: companyId
        })

        // Save the job document
        const newJob = await job.save()

        // Aggregation pipeline to fetch the job along with the associated company and created_by details
        // const populatedJob = await Job.aggregate([
        //     { $match: { _id: newJob._id } },
        //     {
        //         $lookup: {
        //             from: 'companies',  // The collection name for companies
        //             localField: 'company',
        //             foreignField: '_id',
        //             as: 'companyDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',  // The collection name for users
        //             localField: 'created_by',
        //             foreignField: '_id',
        //             as: 'creatorDetails'
        //         }
        //     },
        //     {
        //         $unwind: { path: '$companyDetails', preserveNullAndEmptyArrays: true } // Optionally preserve if no matching company
        //     },
        //     {
        //         $unwind: { path: '$creatorDetails', preserveNullAndEmptyArrays: true } // Optionally preserve if no matching creator
        //     }
        // ])

        // if (!populatedJob || populatedJob.length === 0) {
        //     return res.status(400).json({
        //         message: "Job not posted or details not found",
        //         success: false
        //     })
        // }

        return res.status(200).json({
            message: "Job posted successfully",
            success: true,
            newJob // Return the first (and only) populated job
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}




// get all posted jobs router
const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // const jobs = await Job.find({
        //     $or: [{ title: { $regex: keyword, $options: "i" } },
        //     { description: { $regex: keyword, $options: "i" } }]
        // })

        const jobs = await Job.aggregate([
            {
                $match: { $or: [{ title: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }] }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creatorDetails"
                }
            },
            {
                $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: "$creatorDetails", preserveNullAndEmptyArrays: true }
            }
        ])

        if (!jobs) {
            return res.status(404).json({
                message: "jobs not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Jobs found",
            success: true,
            jobs
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false,
            error
        })
    }


}



// get the recruiter jobs
const getRecruiterJobs = async (req, res) => {
    try {
        const userId = req.user._id

        if (!userId) {
            return res.status(400).json({
                message: "please login first",
                success: false
            })
        }

        const recJob = await Job.find({ created_by: userId })
        if (!recJob) {
            return res.status(404).json({
                message: "oops!  Recruiter jobs not found!",
                success: false
            })
        }


        return res.status(200).json({
            message: "Jobs found",
            success: true,
            recJob
        })


    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }
}



// get job by id router
const getJobById = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        if (!userId) {
            return res.status(400).json({
                message: "userId is required",
                success: false
            });
        }

        // Aggregation pipeline with $lookup (Join with Users collection)
        const byIdJobs = await Job.findById(userId).populate('created_by').populate('company');

        console.log(byIdJobs);


        return res.status(200).json({
            message: "Jobs found with user details",
            success: true,
            data: byIdJobs
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



// apply for the job router
const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id
        const userId = req.user._id

        const existingApplicstion = await Application.findOne({ job: jobId, applicant: userId })
        if (existingApplicstion) {
            return res.status(400).json({
                message: "User already applied for this job",
                success: true
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        })
        const exitJobs = await Job.findById(jobId)
        if (!exitJobs) {
            return res.status(404).json({
                message: "Jobs not found",
                success: true
            })
        }

        exitJobs.applications.push(newApplication._id)
        await exitJobs.save();

        return res.status(200).json({
            mesage: "Applied successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }
}



// get applied jobs router
const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }
            }
        })

        if (!application) {
            return res.status(404).json({
                message: "applications not found"
            })
        }

        return res.status(200).json({
            message: "successfully found",
            success: true,
            application
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server error"
        })
    }

}



// get applied applicants router
const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id
        const applicants = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                options: { sort: { createdAt: -1 } }
            }
        })

        if (!applicants) {
            return res.status(404).json({
                message: "no applicants found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Applicants found",
            success: true,
            applicants
        })

    } catch (error) {
        return res.status(500).json({
            message: "interval server  error",
            success: false
        })
    }
}



// update application status
const updateStatus = async (req, res) => {
    const { status } = req.body
    const applicationId = req.params.id

    try {
        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false
            })
        }


        const application = await Application.findOne({ _id: applicationId })
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        application.status = status
        await application.save()


        return res.status(200).json({
            message: "Status update successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "interval server error",
            success: false
        })
    }
}


export {
    userRegistration,
    userLogin,
    profileUpdate,
    userLogout,
    registerRecruiterCompany,
    getRecruiterCompany,
    updateCompany,
    postJob,
    getAllJobs,
    getRecruiterJobs,
    getJobById,
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus
};

