
const { order_model } = require("../model")
const api_response = require("../helper/response")
const utility = require("../helper/utility")

const ObjectId = require("mongoose").Types.ObjectId

exports.create_order = async (req, res) => {
    try {
        let { price, quantity } = req.body

        req.body.sortingKey = await utility.mongooseGetSortingKey(order_model)
        req.body.orderId = utility.generateOrderId(req.body.sortingKey)
        req.body.userId = new ObjectId(req.myId)
        req.body.createdAt = new Date()
        req.body.updatedAt = new Date()
        req.body.total_price = price * quantity
        let orderResult = await order_model.create(req.body)
        return api_response.SuccessResponeWithData(res, 'Order created successfully', orderResult);

    } catch (error) {
        clg
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_all_order = async (req, res) => {
    try {
        let orderResult = await order_model.find({}).sort({ createdAt: "desc" })//latest order first
        return api_response.SuccessResponeWithData(res, 'Order list generated successfully', orderResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}


exports.get_order_detail = async (req, res) => {
    try {
        if (!req.params?.id) { return api_response.BadRequest(res, "please provide id") }
        let orderResult = await order_model.findById({ _id: req.params.id })
        if (!orderResult) { return api_response.NotFound(res, "Something Went Wrong") }
        return api_response.SuccessResponeWithData(res, 'Order detail generated successfully', orderResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

// Get all orders list with user and product details
exports.get_all_order_with_user_and_product = async (req, res) => {
    try {
        let query = { userId: new ObjectId(req.myId) }
        let filter = [
            { $match: query },
            {
                $lookup: {
                    from: "products",
                    let: { id: "$productId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                        { $project: { name: 1, price: 1, description: 1 } }
                    ],
                    as: "productDetail"
                }
            },
            {
                $unwind: {
                    path: "$productDetail", preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1, profile_pic: 1 } }
                    ],
                    as: "userDetail"
                }
            },
            {
                $unwind: {
                    path: "$userDetail", preserveNullAndEmptyArrays: true
                }
            }
        ]
        let orderResult = await order_model.aggregate(filter)
        return api_response.SuccessResponeWithData(res, 'Order list generated successfully', orderResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}
