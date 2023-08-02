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
const loginRouter = require("./routes/loginRoutes");
const companyRoutes = require("./routes/companyRoutes");
const userRouter = require("./routes/userRoutes");
const tokenService = require("./services/tokenService");
const profileRouter = require("./routes/profileRoutes");
const authController = require("./controller/authController");

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
app.use("/api/login", loginRouter);

//API security
app.use((req, res, next) => {
  const isVerified = tokenService.verifyToken(req);
  if (isVerified.isVerified) {
    next();
  } else {
    //Cookie remove
    res.clearCookie("authToken");
    res.status(401);
    //When token not verify redirect to homepage
    res.redirect("/");
  }
});

//Check islogged value in database
const authLogger = () => {
  return async (req, res, next) => {
    const islogged = await authController.checkUserLogged(req);
    if (islogged) {
      next();
    } else {
      res.clearCookie("authToken");
      res.redirect("/");
    }
  };
};

app.use("/api/private/company", companyRoutes);
app.use("/api/private/user", userRouter);
app.use("/profile", authLogger(), profileRouter);

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
