const fs = require("fs");
const path = require('path')
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

dotenv.config({path: './config/config.env'})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

const bootcampFile = fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8')
const courseFile = fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8')

const bootcamps = JSON.parse(bootcampFile)
const courses = JSON.parse(courseFile)

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log("Data Imported...".green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log("Data Destroyed...".red.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === '-i') {
    importData().then()
} else if (process.argv[2] === '-d') {
    deleteData().then()
}