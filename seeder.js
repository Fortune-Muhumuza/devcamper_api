const fs = require("fs");
const path = require('path')
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

const Bootcamp = require('./models/Bootcamp')

dotenv.config({path: './config/config.env'})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

const bootcampFile = fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8')
const bootcamps = JSON.parse(bootcampFile)

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log("Data Imported...".green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
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