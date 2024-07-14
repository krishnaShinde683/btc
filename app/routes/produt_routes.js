const route= require("express").Router()
const authjwt = require("../middleware/auth_jwt")
const controller=require("../controller/product_controller")
const { productSchema, validate}=require("../middleware/validation")

route.post("/create", validate(productSchema), authjwt.verifyToken, controller.create_product)
route.get("/list", authjwt.verifyToken, controller.get_all_product)
route.get("/detail/:id", authjwt.verifyToken, controller.get_product_detail)

module.exports=route
