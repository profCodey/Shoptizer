"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.userDashboard = exports.logout = exports.getUsers = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const user_1 = require("../model/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const product_1 = require("../model/product");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const duplicatEmail = await user_1.UserInstance.findOne({ where: { email: req.body.email } });
        console.log(duplicatEmail);
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please change email"
            });
        }
        const duplicatePhone = await user_1.UserInstance.findOne({ where: { phonenumber: req.body.phonenumber } });
        if (duplicatePhone) {
            return res.status(409).json({
                msg: "Phone number is used"
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await user_1.UserInstance.create({
            id: id,
            fullname: req.body.fullname,
            email: req.body.email,
            password: passwordHash,
            gender: req.body.gender,
            phonenumber: req.body.phonenumber,
            address: req.body.address
        });
        const apiData = req.headers['postman-token'];
        if (apiData) {
            res.status(201).json({
                msg: "You have successfully created a user",
                record
            });
        }
        else {
            res.redirect("/users/home");
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'failed to register',
            route: '/register'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const User = await user_1.UserInstance.findOne({ where: { email: req.body.email } });
        const { id } = User;
        const token = (0, utils_1.generateToken)({ id });
        res.cookie("token", token, { httpOnly: true }); //store cookie in browser
        const validUser = await bcryptjs_1.default.compare(req.body.password, User.password);
        if (!validUser) {
            return res.status(401).json({
                message: "Password do not match"
            });
        }
        if (validUser) {
            const apiData = req.headers['postman-token'];
            if (apiData) {
                // return User
                return res.status(200).json({
                    message: "Successfully logged in",
                    token,
                    User
                });
            }
            else {
                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    sameSite: 'strict'
                });
                res.cookie('id', id, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    sameSite: 'strict'
                });
                res.redirect("/users/home");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'failed to login',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await user_1.UserInstance.findAndCountAll({ limit, offset,
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }
            ]
        });
        res.status(200).json({
            msg: "You have successfully fetch all users",
            count: record.count,
            record: record.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;
// export async function register(
//    req: Request,
//    res: Response,
//    next: NextFunction
//  ) {
//    try {
//    res.render('registration')
//    } catch (error) {
//      res.status(404).json({
//        msg: "Page not found"
//      });
//    }
//  }
async function logout(req, res) {
    res.clearCookie('token');
    // res.status(200).json({
    //    message: "you have succesfully logged out"
    // })
    res.redirect("/users/login");
}
exports.logout = logout;
// // function to log user to dashboard
// export async function userDashboard(req: Request, res: Response, next: NextFunction) {
//   let id = req.cookies.id;
//   try {
//     const record = await UserInstance.findOne({ where: {id},
//       include: [{
//         model: ProductInstance,
//         as: 'product'
//       }]
//     });
//      console.log(record)
//    res.render('dashboard', {record})
//   } catch (error) {
//     console.log(error)
//     // res.status(500).json({
//     //   message: "error, something went wrong"
//     // })
//   }
// }
// function to log user to dashboard
// export async function userDashboard(req: Request, res: Response, next: NextFunction) {
//   let id = req.cookies.id;
//   try {
//     const record = await UserInstance.findOne({ where: {id},
//       include: [{
//         model: ProductInstance,
//         as: 'product'
//       }]
//     });
//      console.log(record)
//    res.render('dashboard', {record})
//   } catch (error) {
//     console.log(error)
//     // res.status(500).json({
//     //   message: "error, something went wrong"
//     // })
//   }
// }
async function userDashboard(req, res, next) {
    let id = req.cookies.id;
    try {
        const record = await user_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }]
        });
        res.render('dashboard', { record });
        console.log(record);
    }
    catch (error) {
        console.log(error);
        res.redirect('/users/login');
        // res.status(500).json({
        //   message: "error, something went wrong"
        // })
    }
}
exports.userDashboard = userDashboard;
async function user(req, res, next) {
    let id = req.cookies.id;
    try {
        const records = await user_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: product_1.ProductInstance,
                    as: 'product'
                }]
        });
        res.render('loginhome', { records });
    }
    catch (error) {
        console.log(error);
        res.redirect('/users/login');
        // res.status(500).json({
        //   message: "error, something went wrong"
        // })
    }
}
exports.user = user;
// export async function userDetails(req: Request, res: Response, next: NextFunction) {
//   let id = req.cookies.id;
//   try {
//     const record = await UserInstance.findOne({ where: {id},
//       include: [{
//         model: ProductInstance,
//         as: 'product'
//       }]
//     });
//     // console.log(records)
//    res.render('loginhome', {record})
//   } catch (error) {
//     console.log(error)
//     // res.status(500).json({
//     //   message: "error, something went wrong"
//     // })
//   }
// }
// export async function userDetails(req: Request, res: Response, next: NextFunction) {
//   let id = req.cookies.id;
//   try {
//      const details = await UserInstance.findOne({
//         where: { id },
//         include: [{
//         model: UserInstance,
//         as: 'user'
//       }]
//     });
//      console.log(details)
//    res.render('loginhome', {details})
//   } catch (error) {
//     console.log(error)
//     // res.status(500).json({
//     //   message: "error, something went wrong"
//     // })
//   }
// }
