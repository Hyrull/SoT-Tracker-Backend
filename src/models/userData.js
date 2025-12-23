import { Schema, model } from 'mongoose'

const pinnedSchema = new Schema({
    faction: { type: String, required: true },
    emblem: { type: String, required: true },
    campaign: { type: String, required: false }
}, { _id: false }) // we dont need subid for every pinned emblem

const userDataSchema = Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    sotData: {
        type: Map,
        of: Schema.Types.Mixed,
        required: false,
    },
    sotLedgers: {
        type: Map,
        of: Schema.Types.Mixed,
        required: false,
    },
    overview: {
    type: Map,
    of: Schema.Types.Mixed,
    required: false,
    },
    pinned: {
        type: [pinnedSchema],
        required: false,
        default: []
    },
    score: {
        current: {
            type: Number,
            required: false,
            default: 0
        },
        maximum: {
            type: Number,
            required: false,
            default: 0
        }
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

export default model('UserData', userDataSchema)