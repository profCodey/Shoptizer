"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
router.post('/register', userController_1.RegisterUser);
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("registration");
});
router.post('/login', userController_1.LoginUser);
router.get("/home", auth_1.auth, productController_1.loggedHome);
router.get("/home", auth_1.auth, productController_1.loggedHome, userController_1.user);
router.get('/allusers', userController_1.getUsers);
router.get('/logout', userController_1.logout);
router.get('/dashboard', auth_1.auth, userController_1.userDashboard);
router.delete('/logout', userController_1.logout);
exports.default = router;
