const Joi = require('joi');

// User registration validation schema
const userRegisterSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
        .min(8).max(30).required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
        .message('Password must be between 8 and 30 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
});

// User login validation schema
const userLoginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
});


// User profile update validation schema
const userProfileSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
});

// Product creation validation schema
const productSchema = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    description: Joi.string().trim().required(),
});

// Order creation validation schema
const orderSchema = Joi.object({
    productId: Joi.string().trim().min(24).max(24).required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
});


function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req?.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        next();
    };
}

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    userProfileSchema,
    productSchema,
    orderSchema,
    validate
};