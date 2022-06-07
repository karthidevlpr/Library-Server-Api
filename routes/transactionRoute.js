import express from "express";
import httpStatus from "http-status";
import {
  borrowBook, fetchTransaction, listTransaction
} from "../controllers/transactionController.js";

const router = express.Router()

function loginAuth(req, res, next) {
  if (!req.session.loggedInUser) {
      res.status(httpStatus.UNAUTHORIZED).json({unAuthMsg: 'You must login first!'});
  }
  else {
      req.session.save();
      next();
  }
}

router.post('/', loginAuth, borrowBook);
router.get('/', loginAuth, listTransaction);
router.get('/:userId/book/:bookId', loginAuth, fetchTransaction);

export default router