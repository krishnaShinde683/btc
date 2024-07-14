const Router= require("express").Router()


Router.use("/user/",require("./user_auth_routes"))
Router.use("/product/",require("./produt_routes"))
Router.use("/order/",require("./order_routes"))

module.exports=Router
