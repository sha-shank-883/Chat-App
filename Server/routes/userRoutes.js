const {
  register,
  login,
  setAvatar,
  getAllUsers,
  deleteUserProfile,
} = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.delete("/deleteuser/:id", deleteUserProfile);
//localhost:5000/api/auth/deleteuser/6431e41706f86875044ba88e

http: module.exports = router;
