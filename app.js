const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require("multer");

const multiPart = multer().none();

const app = express();

const indexRoutes = require("./routes/indexRoutes");
const signupRouter = require("./routes/signupRoutes");
const companyRoutes = require("./routes/companyRoutes");
const tokenService = require("./services/tokenService");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multiPart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/api/signup", signupRouter);
//API security
app.use((req, res, next) => {
  const isVerified = tokenService.verifyToken(req);
  if (isVerified.isVerified) {
    next();
  } else {
    res.status(401);
    res.json({
      message: "Permission Denied!",
    });
  }
});
app.use("/api/private/company", companyRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
