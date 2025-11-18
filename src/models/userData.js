const mongoose = require('mongoose')

const pinnedSchema = new mongoose.Schema({
    faction: { type: String, required: true },
    emblem: { type: String, required: true },
    campaign: { type: String, required: false }
}, { _id: false }) // we dont need subid for every pinned emblem

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
    sotLedgers: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: false,
    },
    overview: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: false,
    },
    pinned: {
        type: [pinnedSchema],
        required: false,
        default: []
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