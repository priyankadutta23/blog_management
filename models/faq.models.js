const mongoose = require('mongoose')
const bool_val = [true, false]
const status_enum = ["Active", "Inactive"]


const FAQSchema = mongoose.Schema({
    question: { type: String, require: true },
    answer: { type: String, require: true },
    isDeleted: { type: Boolean, default: false, enum: bool_val },
    status: { type: String, default: "Active", enum: status_enum }

}, {
    timestamps: true, versionKey: false

})
module.exports = mongoose.model('faq', FAQSchema)