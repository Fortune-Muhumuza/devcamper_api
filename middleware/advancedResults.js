const advancedResults = (model, populateRef, populateFields) => async (req, res, next) => {
    const reqQuery = {...req.query}
    const removedFields = ['select', 'sort', 'page', 'limit']
    removedFields.forEach(param => delete reqQuery[param])

    const rawQuery = JSON.stringify(reqQuery)
        .replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`)

    const actualQuery = JSON.parse(rawQuery)

    const query = model.find(actualQuery)
        .populate(populateRef, populateFields)

    if (req.query.select) {
        const fields = req.query.select.split(',')
            .join(' ')
        query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',')
            .join(' ')
        query.sort(sortBy)
    } else {
        query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit) || 100;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments();

    query.skip(startIndex)
        .limit(limit)

    const data = await query

    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: data.length,
        pagination,
        data
    }

    next()
}

module.exports = advancedResults