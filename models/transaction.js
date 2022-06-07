import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transactionSchema = mongoose.Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  book: {type: Schema.Types.ObjectId, required: true},
  status: {type: String, enum: ['BORROW', 'RETURN'], required: true},
  issuedDate: {type: Date, required: true, default: Date.now()},
  returnedDate: {type: Date},
})

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction