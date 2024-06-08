import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import cookieParser from "cookie-parser";
import MethodOverride from "method-override";
import pageRoute from "./routes/pageRoute.js";
import advertRoute from "./routes/advertRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkUser } from "./middlewares/authMiddleware.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { checkAdmin } from "./middlewares/checkAdmin.js";
import flatpickr from "flatpickr";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//connection to the DB
conn();

const app = express();
const port = process.env.PORT;

// ejs template engine

app.set("view engine", "ejs");

// static files middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
app.use(
  MethodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//routes
app.use("*", checkUser);
app.use("/", pageRoute);
app.use("/advert", advertRoute);
app.use("/users", userRoute);
app.use("/admin", checkAdmin);

app.listen(port, () => {
  console.log(
    `Applications running on port: ${port}, localhost: http://127.0.0.1:${port}/`
  );
});
