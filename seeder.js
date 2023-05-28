const fs = require("fs");
const path = require('path')
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

dotenv.config({path: './config/config.env'})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

const bootcampFile = fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8')
const courseFile = fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8')
const userFile = fs.readFileSync(path.join(__dirname, '_data', 'users.json'), 'utf-8')
const reviewFile = fs.readFileSync(path.join(__dirname, '_data', 'reviews.json'), 'utf-8')

const bootcamps = JSON.parse(bootcampFile)
const courses = JSON.parse(courseFile)
const users = JSON.parse(userFile)
const reviews = JSON.parse(reviewFile)

const importData = async () => {
    try {
        await User.create(users)
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await Review.create(reviews)
        console.log("Data Imported...".green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

const deleteData = async () => {
    try {
        await User.deleteMany()
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await Review.deleteMany()
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