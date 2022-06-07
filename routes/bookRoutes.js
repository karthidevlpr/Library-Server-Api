import express from "express";
import httpStatus from "http-status";
import {
  createBook, fetchBook, fetchBookImage, listBook, updateBook
} from "../controllers/bookController.js";
import multer from "multer"
import storage from "../multer.js"

const upload = multer({storage: storage})
const router = express.Router()

function loginAuth(req, res, next) {
  console.log('****************234')
  console.log(req.session)
  if (!req.session.loggedInUser) {
      res.status(httpStatus.UNAUTHORIZED).json({unAuthMsg: 'You must login first!'});
  }
  else {
      req.session.save();
      next();
  }
}

router.post('/', upload.single('image'), loginAuth, createBook);
router.get('/', loginAuth, listBook);
router.get('/:id', loginAuth, fetchBook);
router.patch('/:id', loginAuth, updateBook);
router.get('/image/:id', loginAuth, fetchBookImage);

export default router