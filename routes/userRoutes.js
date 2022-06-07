import express from "express";
import httpStatus from "http-status";
import {
  changeActiveStatus,
  createUser,
  fetchUser,
  listUser,
  updateUser
} from "../controllers/userController.js";

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

router.post('/', createUser);
router.get('/', loginAuth, listUser);
router.get('/:id', loginAuth, fetchUser);
router.patch('/:id', loginAuth, updateUser);
router.patch('/:id/changeStatus', loginAuth, changeActiveStatus);

export default router