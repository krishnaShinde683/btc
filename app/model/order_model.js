const mongoose = require('mongoose')

const order_Schema = new mongoose.Schema({
    sortingKey: { type: Number, default: 0 },
    orderId: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'inProgress', 'shipped', 'delivered', 'cancelled', 'return', 'refund', 'release', 'return_pending', 'return_accepted', 'return_inProgress', 'return_shipped', 'return_delivered', 'return_cancelled'],
        default: 'pending',
    },
    total_price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('order', order_Schema)