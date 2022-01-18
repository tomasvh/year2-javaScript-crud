/**
 * Module containing the model for the mongoDB snippet schema.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import mongoose from 'mongoose'

export const snippetSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  postID: { type: Number, required: true, unique: true },
  snippet: { type: String, required: true }
},
{ collection: 'snippets' })

const Snippet = mongoose.model('snippets', snippetSchema)

export default Snippet
