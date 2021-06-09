const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  id: { type: String, required: true, unique: true /*, default: String(Date.now) + String(Math.random)*/ },
  name: { type: String },
  text: { type: String },
  color: { type: String },
  image: { type: String },
  //date: { type: Date, default: Date.now },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
})

module.exports = model('Note', schema)
