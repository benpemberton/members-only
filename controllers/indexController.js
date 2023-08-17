const asyncHandler = require("express-async-handler");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          req.session.messages = [];
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            req.session.messages = [];
            return done(null, false, { message: "Incorrect password" });
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Display detail page for a specific Family.
exports.home_page = asyncHandler(async (req, res, next) => {
  // // Get array of all messages
  const messages = await Message.find().populate("author").exec();

  console.log(messages);

  res.render("index", {
    title: "Home",
    user: req.user,
    messages: messages,
  });
});

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
      res.redirect("/login");
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
  failureRedirect: "/login",
  failureMessage: true,
});

// Display member form on GET.
exports.member_get = (req, res, next) => {
  if (!req.user) res.redirect("/login");

  res.render("member_form", {
    title: "Member check",
    user: req.user,
  });
};

// Handle member form on POST.
exports.member_post = asyncHandler(async (req, res, next) => {
  console.log(req.body.password + "-----" + req.user);

  if (req.body.password == process.env.MEMBER_PASSWORD) {
    const user = await User.findById(req.user._id);
    user.status = "Member";
    await user.save();
    res.redirect("/");
  } else {
    res.render("member_form", {
      title: "Member check",
      user: req.user,
      errors: [`That password wasn't correct`],
    });
    return;
  }
});

// Display admin form on GET.
exports.admin_get = (req, res, next) => {
  if (!req.user) res.redirect("/login");

  res.render("admin_form", {
    title: "admin check",
    user: req.user,
  });
};

// Handle admin form on POST.
exports.admin_post = asyncHandler(async (req, res, next) => {
  if (req.body.password == process.env.ADMIN_PASSWORD) {
    const user = await User.findById(req.user._id);
    user.admin = true;
    await user.save();
    res.redirect("/");
  } else {
    res.render("admin_form", {
      title: "Admin check",
      user: req.user,
      errors: [`That password wasn't correct`],
    });
    return;
  }
});

// Handle add message form on POST.
exports.add_message_post = [
  // Validate and sanitize fields.
  body("title", "Title must be between 1 and 200 characters.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("message", "Message must be between 3 and 400 characters.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create User object with escaped and trimmed data
    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render home page with sanitized values/errors messages in message form.
      res.render("index", {
        title: "Home",
        currentMessage: message,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Add message to db
      await message.save();

      // Reload homepage with new message.
      res.redirect("/");
    }
  }),
];
