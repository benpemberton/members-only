const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

// Display sign up form on GET.
exports.signup_get = (req, res, next) => {
  res.render("signup_form", {
    title: "Sign up",
  });
};

// Handle sign up form on POST.
exports.signup_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must be specified.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body("last_name", "Last name must be specified.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body("username")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Username must not exceed 100 characters.")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Email address already registered");
      }
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must  have at least 8 characters.")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create User object with escaped and trimmed data
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("signup_form", {
        title: "Sign up",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // encrypt password and save user
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) throw new Error(err);
          user.password = await hashedPassword;
          await user.save();
        });
      } catch (err) {
        return next(err);
      }

      // Redirect to home.
      res.redirect("/");
    }
  }),
];

// Display log in form on GET.
exports.login_get = (req, res, next) => {
  res.render("login_form", {
    title: "Log in",
    messages: req.session.messages,
  });
};

// Handle log in form on POST.
exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureMessage: true,
});

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
