
const { user_model } = require("../model")
const api_response = require("../helper/response")
const utility = require("../helper/utility")

const auth_jwt = require("../middleware/auth_jwt")


exports.user_sign_up = async (req, res) => {
  try {
    req.body.createdAt = new Date()
    req.body.updatedAt = new Date()
    let user = await user_model.create(req.body)
    let data = {
      email: user.email,
      _id: user._id
    }
    let token = await auth_jwt.generateAuthToken(data)
    let userUpdate = await user_model.findByIdAndUpdate({ _id: user._id }, { token: token }, { new: true }).select({ password: 0 })
    return api_response.SuccessResponeWithData(res, "user registered successfully", userUpdate)
  } catch (error) {
    if (error.code == 11000) return api_response.BadRequest(res, "email is already in use");
    return api_response.ErrorResponse(res, error.message);
  }
}

exports.user_login = async (req, res) => {
  try {

    let { email, password } = req.body
    const user = await user_model.findOne({ email: email })
    if (!user) {
      // Username not found
      return api_response.NotFound(res, 'Invalid username or password');
    }
    const isMatch = await utility.pass_compare(password, user?.password);
    if (!isMatch) {
      // Incorrect password
      return api_response.UnAuthorized(res, 'Invalid username or password')
    }
    let data = {
      email: user.email,
      _id: user._id
    }
    let token = await auth_jwt.generateAuthToken(data)
    let userUpdate = await user_model.findByIdAndUpdate({ _id: user._id }, { token: token }, { new: true }).select({ password: 0 })

    return api_response.SuccessResponeWithData(res, 'User Login Success', userUpdate);
  } catch (error) {
    return api_response.ErrorResponse(res, error.message);
  }
}


exports.user_detail = async (req, res) => {
  try {
    const user = await user_model.findById({ _id: req.myId }).select({ password: 0 })
    if (!user) return api_response.NotFound(res, 'Something Went Wrong');
    return api_response.SuccessResponeWithData(res, 'User detail fetched', user);

  } catch (error) {
    console.log(error);
    return api_response.ErrorResponse(res, error.message);
  }
}

exports.user_update = async (req, res) => {
  try {
    let updateobj = {
      updatedAt: new Date()
    }
    if (req.body?.firstName) {
      updateobj.firstName = req.body?.firstName
    }
    if (req.body?.lastName) {
      updateobj.lastName = req.body?.lastName
    }

    if (Object.keys(req?.body)?.length === 0 && !req?.file) {
      delete updateobj.updatedAt
    }
    if (req?.file) {
      updateobj.profile_pic = req.file.path.replace(/\\/g, "/")
    }
    const user = await user_model.findByIdAndUpdate({ _id: req.myId }, updateobj, { new: true }).select({ password: 0 })
    if (!user) return api_response.NotFound(res, 'Something Went Wrong');
    return api_response.SuccessResponeWithData(res, 'User update Successfully', user);

  } catch (error) {
    console.log(error);
    return api_response.ErrorResponse(res, error.message);
  }
}

// Get all user lists with orders and product details
exports.get_all_user_with_order_and_product = async (req, res) => {
  try {
    let filter = [
      { $match: {} },
      {
        $lookup: {
          from: "orders",
          let: { id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$id", "$userId"] } } },
            { $project: { userId: 0, createdAt: 0, updatedAt: 0 } },
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
            }
          ],
          as: "orderDetail"
        }
      },
      {
        $unwind: {
          path: "$orderDetail", preserveNullAndEmptyArrays: true
        }
      },
      { $project: { password: 0, token: 0, createdAt: 0, updatedAt: 0 } }
    ]
    let userResult = await user_model.aggregate(filter)
    return api_response.SuccessResponeWithData(res, 'Order list generated successfully', userResult);
  } catch (error) {
    return api_response.ErrorResponse(res, error.message)
  }
}
