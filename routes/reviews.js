const express = require('express')
const {getReviews} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const {protect, authorize} = require('../middleware/auth')

const router = express.Router({mergeParams: true})

router.route('/')
    .get([advancedResults(Review, 'bootcamp', 'name description'), getReviews])

module.exports = router