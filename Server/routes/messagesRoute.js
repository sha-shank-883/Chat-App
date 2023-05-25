const {
  addMessage,
  getAllMessage,
  deleteMessage,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);
// router.delete("/deletemsg/:id", deleteMessage);

module.exports = router;
