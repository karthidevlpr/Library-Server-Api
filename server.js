import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import dontenv from "dotenv";
import session from "express-session"
import dbConnection from "./db.js";
import routes from "./routes/routes.js"

dontenv.config();
const app = express();
const PORT = process.env.PORT|| 7000;

app.use(bodyParser.json({extended: true, limit:'30mb'}))
app.use(bodyParser.urlencoded({extended: true, limit:'30mb'}));
app.use(morgan('combined'));
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie: {sameSite: false, path: '/', httpOnly: true, maxAge: 30 * 30000},
  rolling: true
}));

routes(app);

dbConnection().then(() => app.listen(PORT, '0.0.0.0', () =>
console.info(`Server Running on Port: http://localhost:${PORT}`)))
.catch((error) => console.log(`${error} did not connect`));