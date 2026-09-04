const { Signup, Login, Logout } = require("../controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/", userVerification);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

module.exports = router;
