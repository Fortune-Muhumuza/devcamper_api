const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const path = require("path")
const fileuploader = require("express-fileupload")
const bootcampsRouter = require("./routes/bootcamps")
const coursesRouter = require('./routes/courses')
const authRouter = require("./routes/auth")
const connectDB = require("./config/db")
const errorHandler = require('./middleware/error')


dotenv.config({path: './config/config.env'})

const app = express();
connectDB()

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(fileuploader({}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/auth', authRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.red);
    server.close(() => process.exit(1))
})