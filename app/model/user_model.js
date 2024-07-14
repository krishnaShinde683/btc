const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const validator = require("validator");
const config = require("../config/config");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'firstName is required'] },
  lastName: { type: String, required: [true, 'lastName is required'] },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email already exists'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [128, 'Password must be less than 128 characters long'],
    // validate: {
    //   validator: function(value) {
    //     // Require at least one uppercase letter, one lowercase letter, one special character and one number
    //     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
    //     return regex.test(value);
    //   },
    //   message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number'
    // }
  },
  token: { type: String, default: "" },
  profile_pic: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
})

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(parseInt(config.SALT));
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});


module.exports = mongoose.model("user", userSchema)