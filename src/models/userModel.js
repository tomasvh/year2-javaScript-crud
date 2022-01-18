/**
 * Module containing the mongoDB user schema.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userModel = new Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 10 }
},
{ collection: 'users' })

const User = mongoose.model('users', userModel)

export default User
