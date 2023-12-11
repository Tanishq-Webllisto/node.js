const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const controller = require("../controllers/userController")

router.post("/register", controller.register);

router.post("/register-admin", controller.registerAdmin);

router.get("/login", controller.login);

router.get("/get-user-info-by-id", authMiddleware, controller.getUserInfoById);

router.get("/get-all-users", authMiddleware, controller.getAllUser);

module.exports = router;
