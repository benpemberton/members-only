const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/authController");

/* GET sign up page. */
router.get("/signup", auth_controller.signup_get);

/* Post sign up page. */
router.post("/signup", auth_controller.signup_post);

/* GET log in page. */
router.get("/login", auth_controller.login_get);

/* POST log in page. */
router.post("/login", auth_controller.login_post);

/* GET log user out */
router.get("/logout", auth_controller.logout_get);

module.exports = router;
