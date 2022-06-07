import Transaction from "../models/transaction.js";
import Book from "../models/bookModel.js";
import httpStatus from "http-status";
import _ from "lodash"
import {errorHandling} from "./validation.js";


export const borrowBook = async (req, res) => {
  const {book, user, status} = req.body
  const updateData = status === 'BORROW' ? {...req.body, returnedDate: null} : {...req.body, returnedDate: Date.now()}
  try {
    let transaction = await Transaction.findOneAndUpdate({book: book, user: user}, updateData, {
      upsert: true,
      new: true
    })
    let availability = transaction.status !== 'BORROW'
    let updatedBook = await Book.findByIdAndUpdate(transaction.book, {
      $set: {
        availability: availability,
        updatedOn: Date.now()
      }
    })
    if (_.isNull(updatedBook)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'Book not found'});
      return;
    }
    res.status(httpStatus.CREATED).json(transaction);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const listTransaction = async (req, res) => {
  try {
    let transactions = await Transaction.find();
    res.status(httpStatus.ACCEPTED).json(transactions);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const fetchTransaction = async (req, res) => {
  const {userId, bookId} = req.params
  try {
    let transaction = await Transaction.findOne({book: bookId, user: userId});
    if (_.isNull(transaction)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'Transaction not found'});
      return;
    }
    res.status(httpStatus.OK).json(transaction);
  } catch (error) {
    errorHandling(error, res);
  }
}
