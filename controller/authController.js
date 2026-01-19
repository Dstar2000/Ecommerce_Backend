import { hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"

export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address} = req.body

        if(!name) {
            return res.status(400).send({
                message: "Name is required"
            })
        }

        if(!email) {
            return res.status(400).send({
                message: "Email is required"
            })
        }

        if(!password) {
            return res.status(400).send({
                message: "Password is required"
            })
        }

        if(!phone) {
            return res.status(400).send({
                message: "Phone is required"
            })
        }

        if(!address) {
            return res.status(400).send({
                message: "Address is required"
            })
        }

        const existingUser = await userModel.findOne({email})

        if(user) {
            return res.status(400).send({
                success: false,
                message: "User already exists"
            })
        }

        // Hash Password
        const hashedPassword = await hashPassword(password)

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        })

        return res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user
        })

     
    } catch(error) {
        console.log(error)
        res.status(500).send({
            message: "Error in Register Controller",
            error
        })
    }
}