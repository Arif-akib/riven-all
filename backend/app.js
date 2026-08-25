const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

require("dotenv/config");

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // VERY IMPORTANT for cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("tiny"));

const api = process.env.API_URL;

app.use(`${api}/user`, require("./routes/user.routes"));
app.use(`${api}/products`, require("./routes/product.routes"));
app.use(`${api}/category`, require("./routes/category.routes"));
app.use(`${api}/subcategory`, require("./routes/subcategory.routes"));
app.use(`${api}/cms`, require("./routes/cms.routes"));
app.use(`${api}/order`, require("./routes/order.routes"));


app.use(errorMiddleware);

module.exports = app;
