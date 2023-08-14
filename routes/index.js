const express = require("express");
const router = express.Router();
const index_controller = require("../controllers/indexController");

/* GET home page. */
router.get("/", index_controller.messages_list);

/* GET home page. */
router.get("/signup", index_controller.signup_get);

/* GET home page. */
router.post("/signup", index_controller.signup_post);

module.exports = router;
