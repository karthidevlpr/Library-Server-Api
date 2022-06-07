import mongoose from "mongoose";
import Image from "./imageModel.js"

const Schema = mongoose.Schema;

const bookSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  author: {type: String, required: true},
  image: {type: Schema.Types.ObjectId, ref: 'Image', required: true},
  availability: {type: Boolean, required: true, default: true},
  createdOn: {type: Date, default: Date.now, required: true},
  updatedOn: {type: Date, default: Date.now, required: true}
})

const Book = mongoose.model('Book', bookSchema)

export default Book