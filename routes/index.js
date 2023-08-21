const express = require("express");
const router = express.Router();
const index_controller = require("../controllers/indexController");

/* GET home page. */
router.get("/", index_controller.home_page);

/* GET member page. */
router.get("/member", index_controller.member_get);

/* POST member page. */
router.post("/member", index_controller.member_post);

/* GET admin page. */
router.get("/admin", index_controller.admin_get);

/* POST admin page. */
router.post("/admin", index_controller.admin_post);

/* POST add message form. */
router.post("/add-message", index_controller.add_message_post);

// GET request to delete message.
router.get("/:id/delete", index_controller.delete_message_get);

// POST request to delete message.
router.post("/:id/delete", index_controller.delete_message_post);

module.exports = router;
