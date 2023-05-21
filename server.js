const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const bootcampsRouter = require("./routes/bootcamps")
const connectDB = require("./config/db")


dotenv.config({path: './config/config.env'})


const app = express();
connectDB()

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use('/api/v1/bootcampsRouter', bootcampsRouter)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.method}`.red);
    server.close(() => process.exit(1))
})