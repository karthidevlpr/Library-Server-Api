import userRouter from './userRoutes.js'
import loginRoutes from './loginRoutes.js'
import express from "express";
import bookRoutes from "./bookRoutes.js";
import transactionRoute from "./transactionRoute.js";

const router = express.Router()

export default (app) => {

  app.use(router.all('/', (req, res) => {
    res.send('API server for Library Management')
  }));

  app.use('/user', userRouter)
  app.use('/auth', loginRoutes)
  app.use('/book', bookRoutes)
  app.use('/transaction', transactionRoute)
}