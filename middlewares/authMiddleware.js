import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js"

// Protected Routes
export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if(!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized"
            })
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in auth middleware",
            error
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized"
            })
        }
        next()
    } catch(error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in admin middleware",
            error
        })
    }
}