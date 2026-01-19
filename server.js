import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoute.js"


// Config Dotenv
dotenv.config()

// Database Connection
connectDB();

// Rest Object
const app = express()

// Middeware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/v1/auth", authRoutes)

// Routes
app.get("/", (req, res) => {
    res.send({
        message:"welcome to ecommerce"
    })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} port ${PORT}`)
})