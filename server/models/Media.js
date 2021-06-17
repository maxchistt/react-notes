/**
 * @file Media.js
 */
const { Schema, model, Types } = require('mongoose')

/**
 * Схема media для базы данных
 */
const schema = new Schema({
    id: { type: String, required: true, unique: true },
    data: { type: String },
    note: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
})

module.exports = model('Media', schema)
