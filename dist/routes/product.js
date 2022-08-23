"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const productController_1 = require("../controller/productController");
router.post('/create', auth_1.auth, productController_1.Product);
router.get('/add', auth_1.auth, (req, res) => {
    res.render('addProduct');
});
router.get('/read', productController_1.getProducts);
router.get('/read/:id', auth_1.auth, productController_1.getSingleProduct);
router.patch('/update/:id', auth_1.auth, productController_1.updateProduct);
router.post('/update/:id', auth_1.auth, productController_1.updateProduct);
router.delete('/delete/:id', auth_1.auth, productController_1.deleteProduct);
router.post('/delete/:id', auth_1.auth, productController_1.deleteProduct);
router.get("/update/:id", auth_1.auth, productController_1.getSingleProduct);
exports.default = router;
