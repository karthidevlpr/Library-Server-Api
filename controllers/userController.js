import User from "../models/usermodel.js";
import httpStatus from "http-status";
import _ from "lodash"
import CryptoJS from "crypto-js"
import {errorHandling} from "./validation.js";
import {mailNotification} from "./mailController.js";

const secretKey = 'secret key 123'

export const createUser = async (req, res) => {
  const userData = req.body
  let userInfo;
  if (userData.role === 'ADMIN') {
    let encryptPassword = CryptoJS.AES.encrypt(userData.password, 'secret key 123').toString();
    userInfo = {...userData, password: encryptPassword}
  } else {
    userInfo = {...userData}
  }
  const newUser = new User(userInfo)
  try {
    let user = await newUser.save();
    let mailInfo = {
      to: user.email,
      subject: 'Welcome to Library Management',
      html: `<h3>Welcome {$user.name}</h3>`
    }
    if (user.role === 'ADMIN')
      await mailNotification(mailInfo)
    res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    console.log(error)
    errorHandling(error, res)
  }
}

export const listUser = async (req, res) => {
  try {
    let users = await User.find({active: true});
    res.status(httpStatus.ACCEPTED).json(users);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const fetchUser = async (req, res) => {
  let {id} = req.params
  try {
    let user = await User.findById(id, {password: 0});
    if (_.isNull(user)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'User not found'});
      return;
    }
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    errorHandling(error, res)
  }
}

export const updateUser = async (req, res) => {
  let {id} = req.params
  let userData = req.body
  try {
    let updatedUser = await User.findByIdAndUpdate(id, {$set: userData}, {new: true})
    if (_.isNull(updatedUser)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'User not found'});
      return;
    }
    res.status(httpStatus.OK).json(updatedUser);
  } catch (error) {
    console.log(error)
    errorHandling(error, res)
  }
}

export const changeActiveStatus = async (req, res) => {
  let {id} = req.params
  try {
    let user = await User.findById(id)
    if (_.isNull(user)) {
      res.status(httpStatus.NOT_FOUND).json({error: 'User not found'});
      return;
    }
    let updatedUser = await User.findByIdAndUpdate(id, {$set: {active: !user.active}}, {new: true})
    res.status(httpStatus.OK).json(updatedUser);
  } catch (error) {
    console.log(error)
    errorHandling(error, res)
  }
}