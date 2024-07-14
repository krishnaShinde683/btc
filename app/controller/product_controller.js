
const { product_model } = require("../model")
const api_response = require("../helper/response")

exports.create_product = async (req, res) => {
    try {
        req.body.createdAt = new Date()
        req.body.updatedAt = new Date()
        let productResult = await product_model.create(req.body)
        return api_response.SuccessResponeWithData(res, 'Product created successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_all_product = async (req, res) => {
    try {
        let productResult = await product_model.find({}).sort({ createdAt: "desc" })
        return api_response.SuccessResponeWithData(res, 'Product list generated successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}


exports.get_product_detail = async (req, res) => {
    try {
        if (!req.params?.id) { return api_response.BadRequest(res, "please provide id") }
        let productResult = await product_model.findById({ _id: req.params?.id })
        if (!productResult) { return api_response.NotFound(res, "Something Went Wrong") }
        return api_response.SuccessResponeWithData(res, 'Product detail generated successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}
