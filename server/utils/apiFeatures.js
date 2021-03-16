class APIFeatures {
	constructor(query, queryObj) {
		// mongoose query object
		this.query = query
		// request query object req.query
		this.queryObj = queryObj
	}

	filter() {
		// BUILD QUERY
		let queryObj = { ...this.queryObj }
		const excludedFields = ['sort', 'offset', 'length', 'fields']
		excludedFields.forEach(el => delete queryObj[el])

		// FILTERING
		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
			return `$${match}`
		})
		this.query.find(JSON.parse(queryStr))
		return this
	}

	sort() {
		if (this.queryObj.sort) {
			const sortBy = this.queryObj.sort.split(',').join(' ')
			this.query.sort(sortBy)
		} else {
			this.query.sort('-createdAt')
		}
		return this
	}

	limitFields() {
		if (this.queryObj.fields) {
			const fields = this.queryObj.fields.split(',').join(' ')
			// console.log(fields);
			this.query.select(fields)
		} else {
			this.query.select('-__v')
		}
		return this
	}

	paginate() {
		// PAGINATION
		const offset = this.queryObj.offset * 1
		const length = this.queryObj.length * 1
		this.query.skip(offset).limit(length)
		return this
	}
}

module.exports = APIFeatures
