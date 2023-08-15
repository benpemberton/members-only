const express = require("express");
const router = express.Router();
const index_controller = require("../controllers/indexController");

/* GET home page. */
router.get("/", index_controller.home_page);

/* GET sign up page. */
router.get("/signup", index_controller.signup_get);

/* Post sign up page. */
router.post("/signup", index_controller.signup_post);

/* GET log in page. */
router.get("/login", index_controller.login_get);

/* POST log in page. */
router.post("/login", index_controller.login_post);

module.exports = router;
