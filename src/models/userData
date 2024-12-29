const mongoose = require('mongoose')

const userDataSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    sotData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: false,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
    changesSinceLastUpdate: {
        type: Map,
        of: String,
        required: false,
    }
})

module.exports = mongoose.model('UserData', userDataSchema)