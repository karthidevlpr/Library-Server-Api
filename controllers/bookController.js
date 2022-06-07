import Book from "../models/bookModel.js";
import Image from "../models/imageModel.js";
import httpStatus from "http-status";
import fs from "fs"
import _ from "lodash"
import {errorHandling} from "./validation.js";

export const createBook = async (req, res) => {
  const bookData = req.body
  try {

    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
      contentType: req.file.mimetype,
      data: new Buffer(encode_img, 'base64')
    };
    const imageData = {name: req.file.originalname, img: final_img}
    const newImage = new Image(imageData)
    let savedImage = await newImage.save();
    const newBook = new Book({...bookData, image: savedImage._id})
    let book = await newBook.save();
    fs.unlinkSync(req.file.path)
    res.status(httpStatus.CREATED).json(book);
  } catch (error) {
    console.log(error)
    errorHandling(error, res)
  }
}

export const listBook = async (req, res) => {
  try {
    let books = await Book.find().populate('image');
    res.status(httpStatus.ACCEPTED).json(books);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const fetchBook = async (req, res) => {
  let {id} = req.params
  try {
    let book = await Book.findById(id);
    if (_.isNull(book)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'Book not found'});
      return;
    }
    res.status(httpStatus.OK).json(book);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const updateBook = async (req, res) => {
  let {id} = req.params
  let bookData = {...req.body, updatedOn: Date.now()}
  try {
    let updatedBook = await Book.findByIdAndUpdate(id, {$set: {...bookData}}, {new: true});
    if (_.isNull(updatedBook)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'Book not found'});
      return;
    }
    res.status(httpStatus.OK).json(updatedBook);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const fetchBookImage = async (req, res) => {
  let {id} = req.params
  try {
    let image = await Image.findOne({image: id});
    if (_.isNull(image)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'Image not found'});
      return;
    }
    let encode_img = image.img.data.toString('base64');
    let final_img = {
      contentType: image.img.contentType,
      image: new Buffer(encode_img, 'base64')
    };
    res.contentType(final_img.contentType);
    res.send(final_img.image);
  } catch (error) {
    console.log(error)
    errorHandling(error, res)
  }
}