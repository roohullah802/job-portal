import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(404).json({
                message: "User not authenticated!",
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_KET)
        if (!decode) {
            return res.status(400).json({
                message: "token verify failed",
                success: false
            })
        }

        req.user = decode
        next()
    } catch (error) {
        return res.status(500).json({
            message: "internal server errr"
        })
    }
}

export {isAuthenticated}