import express from "express";
import {authenticate, getLoggedInUser, logout} from "../controllers/loginController.js";

const router = express.Router()

router.post('/authenticate', authenticate);
router.get('/logout', logout);
router.get('/getLoggedInUser', getLoggedInUser);

export default router