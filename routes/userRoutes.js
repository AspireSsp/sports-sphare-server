const express = require('express');
const { register, login, getUser, updateUser, getAllUser } = require('../controller/user');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/get").get(authenticate, getUser);
router.route("/get/all").get(authenticate, getAllUser);
router.route("/update/:id").patch(authenticate, updateUser);


module.exports = router; 































// const express = require('express');
// const { registerUser, loginUser } = require("../controller/userController");
// const router = express.Router();


// router.route("/register").post(registerUser)

// router.route("/login").post(loginUser)
 

// module.exports = router; 