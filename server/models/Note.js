/**
 * @file Note.js
 */
const { Schema, model, Types } = require('mongoose')

/**
 * Схема заметки для базы данных
 */
const schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  text: { type: String },
  color: { type: String },
  image: { type: String },
  order: { type: Number },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
})

module.exports = model('Note', schema)
