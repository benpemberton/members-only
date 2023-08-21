const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/message");

// Display detail page for a specific Family.
exports.home_page = asyncHandler(async (req, res, next) => {
  // // Get array of all messages
  const messages = await Message.find()
    .populate("author")
    .sort({ createdAt: -1 })
    .exec();

  res.render("index", {
    title: "Home",
    messages: messages,
  });
});

// Display member form on GET.
exports.member_get = (req, res, next) => {
  if (!req.user) res.redirect("/user/login");

  res.render("member_form", {
    title: "Member check",
  });
};

// Handle member form on POST.
exports.member_post = asyncHandler(async (req, res, next) => {
  if (req.body.password == process.env.MEMBER_PASSWORD) {
    const user = await User.findById(req.user._id);
    user.status = "Member";
    await user.save();
    res.redirect("/");
  } else {
    res.render("member_form", {
      title: "Member check",
      errors: [`That password wasn't correct`],
    });
    return;
  }
});

// Display admin form on GET.
exports.admin_get = (req, res, next) => {
  if (!req.user) res.redirect("/user/login");

  res.render("admin_form", {
    title: "admin check",
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

// Display message delete form on GET.
exports.delete_message_get = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await Message.findById(req.params.id)
    .populate("author")
    .exec();

  if (message === null || !req.user?.admin) {
    // No results or user not admin.
    res.redirect("/");
  }

  res.render("message_delete", {
    title: "Delete Message",
    message: message,
  });
});

// Handle message delete on POST.
exports.delete_message_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to home page.
  await Message.findByIdAndRemove(req.body.messageid);
  res.redirect("/");
});
