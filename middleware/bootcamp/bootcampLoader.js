const asyncHandler = require("../async")
const Bootcamp = require("../../models/Bootcamp");
const ErrorResponse = require("../../utils/errorResponse");

module.exports = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id || req.params.bootcampId)

    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id || req.params.bootcampId}`, 404))
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401))
    }

    req.bootcamp = bootcamp
    next()
})