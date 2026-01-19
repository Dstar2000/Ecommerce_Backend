import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken"

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

        if (existingUser) {
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
       console.error("REGISTER CONTROLLER ERROR 👉", error)

    return res.status(500).json({
      success: false,
      message: "Error in Register Controller",
      error: error.message
        })
    }
}

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      })
    }

    const token = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error("LOGIN CONTROLLER ERROR 👉", error)

    return res.status(500).json({
      success: false,
      message: "Error in Login Controller",
      error: error.message
    })
  }
}
