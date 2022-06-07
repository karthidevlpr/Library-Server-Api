import User from "../models/usermodel.js";
import httpStatus from "http-status";
import _ from "lodash"
import CryptoJS from "crypto-js"
import {errorHandling} from "./validation.js";


export const authenticate = async (req, res) => {
  let {email, password} = req.body

  try {
    let user = await User.findOne({email: new RegExp('^' + email + '$', 'i'), active: true});
    if (_.isNull(user)) {
      res.status(httpStatus.NOT_FOUND).json({error: `Email doesn't exist`});
      return;
    }
    let bytes = CryptoJS.AES.decrypt(user.password, 'secret key 123');
    let decryptPassword = bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptPassword)
    if (password !== decryptPassword) {
      res.status(httpStatus.NOT_FOUND).json({error: `Password doesn't match`});
      return;
    }
    req.session.loggedInUser = user
    req.session.save();
    console.log(req.session)
    res.status(httpStatus.OK).json({message: 'You are successfully logged in', user: user});
  } catch (error) {
    errorHandling(error, res)
  }
}

export const logout = async (req, res) => {
  if (req.session.loggedInUser) {
    req.session.destroy();
    res.status(httpStatus.OK).json({success: "logout successfully"});
  }
}

export const getLoggedInUser = async (req, res) => {        // Get Logged in user details.

  try {
    if (req.session.loggedInUser) {
      res.status(httpStatus.OK).json(req.session.loggedInUser);

    } else {
      res.status(httpStatus.UNAUTHORIZED).json({error: 'Session invalid'});
    }
  } catch (err) {
    errorHandling(err, res)
  }
};