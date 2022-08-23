"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedHome = exports.getHomePage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getProducts = exports.Product = void 0;
const uuid_1 = require("uuid");
const product_1 = require("../model/product");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function Product(req, res, next) {
    const id = (0, uuid_1.v4)();
    // let todo = {...req.body, id}
    try {
        const verified = req.user;
        const validationResult = utils_1.createProductSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await product_1.ProductInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        const api = req.headers['postman-token'];
        if (api) {
            return res.status(201).json({
                msg: "You have successfully uploaded an item",
                record,
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
    }
    catch (err) {
        return res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.Product = Product;
;
async function getProducts(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await product_1.ProductInstance.findAndCountAll({ limit, offset,
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'fullname', 'email', 'gender', 'phonenumber', 'address'],
                    as: 'user' //We are including it product because that is the name of the table in the database
                }
            ]
        });
        const apiData = req.headers['postman-token'];
        if (apiData) {
            return res.status(200).json({
                msg: "You have successfully fetch all product",
                count: record.count,
                record: record.rows,
            });
        }
        else {
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getProducts = getProducts;
async function getSingleProduct(req, res, next) {
    try {
        const { id } = req.params;
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        console.log(record);
        const apiTest = req.headers['postman-token'];
        if (apiTest) {
            return res.status(200).json({
                msg: "Successfully gotten user information",
                record,
            });
        }
        else {
            return res.render('editProduct', { record });
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to read single product",
            route: "/read/:id",
        });
    }
}
exports.getSingleProduct = getSingleProduct;
;
async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;
        const validationResult = utils_1.updateProductSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing product",
            });
        }
        const updatedrecord = await record.update({
            name: name,
            image: image,
            brand: brand,
            category: category,
            description: description,
            price: price,
            countInStock: countInStock,
            rating: rating,
            numReviews: numReviews
        });
        const apiData = req.headers['postman-token'];
        if (apiData) {
            return res.status(200).json({
                msg: "You have successfully updated your product",
                updatedrecord
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateProduct = updateProduct;
async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        const record = await product_1.ProductInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find product",
            });
        }
        const deletedRecord = await record.destroy();
        const api = req.headers['postman-token'];
        if (api) {
            return res.status(200).json({
                msg: "Product deleted successfully",
                deletedRecord,
            });
        }
        else {
            res.redirect('/users/dashboard');
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteProduct = deleteProduct;
async function getHomePage(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await product_1.ProductInstance.findAll({ limit, offset,
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'fullname', 'email', 'gender', 'phonenumber', 'address'],
                    as: 'user' //We are including it product because that is the name of the table in the database
                }
            ]
        });
        res.render("index", {
            record
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getHomePage = getHomePage;
async function loggedHome(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await product_1.ProductInstance.findAll({ limit, offset,
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'fullname', 'email', 'gender', 'phonenumber', 'address'],
                    as: 'user' //We are including it product because that is the name of the table in the database
                }
            ]
        });
        res.render("loginhome", {
            record
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.loggedHome = loggedHome;
