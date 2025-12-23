import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const userSchema = Schema({
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ratToken: { type: String, required: false },
  createdAt: { type: String, required: true },
})

userSchema.plugin(mongooseUniqueValidator)

export default model('User', userSchema)