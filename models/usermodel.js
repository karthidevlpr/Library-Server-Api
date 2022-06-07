import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  address: {type: String},
  role: {type: String, enum: ['ADMIN', 'USER'], required: true},
  password: {type: String},
  email: {type: String, required: true, match: /.+\@.+\..+/, unique: true},
  active: {type: Boolean, default: true, required: true},
  createdOn: {type: Date, default: Date.now, required: true}
})

const User = mongoose.model('User', userSchema)

export default User