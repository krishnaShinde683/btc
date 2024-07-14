const route= require("express").Router()
const authjwt = require("../middleware/auth_jwt")
const controller=require("../controller/order_controller")
const { orderSchema, validate}=require("../middleware/validation")

route.post("/create", authjwt.verifyToken, validate(orderSchema), controller.create_order)
route.get("/list", authjwt.verifyToken, controller.get_all_order)
route.get("/detail/:id", authjwt.verifyToken, controller.get_order_detail)
route.get("/get-all-order-with-user-and-product", authjwt.verifyToken, controller.get_all_order_with_user_and_product)

module.exports=route
