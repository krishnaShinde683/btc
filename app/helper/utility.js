const bcryptjs = require('bcryptjs');
const EnvConfig = require('../config/config');


exports.mongooseGetSortingKey = async (collectionName) => {
    if (await collectionName.countDocuments() === 0) return 1
    const result = await collectionName.findOne({}, { sortingKey: 1 }, { sort: { 'sortingKey': -1 } })
    const sortingKey = result.sortingKey || 0
    return sortingKey + 1
}

exports.generateOrderId = (sortingkey) => {
    if (!sortingkey) { return new Error("Provide sortingkey") }
    let now = new Date()
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    let orderId = "OP" + new Date().getFullYear() + month + sortingkey
    return orderId
}

exports.create_hash = async (password) => {
    let salt = await bcryptjs.genSalt(parseInt(EnvConfig.SALT))
    let hash = await bcryptjs.hash(password, salt)
    return hash
}

exports.pass_compare = async (password, hashpassword) => {
    if (!hashpassword) return null
    let pass = await bcryptjs.compare(password, hashpassword)
    console.log(pass)
    return pass
}
