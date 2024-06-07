const mongoose = require('mongoose')
const bool_val = [true, false]
const status_enum = ["Active", "Inactive"]

const BannerSchema = mongoose.Schema({
    heading: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, enum: bool_val },
    status: { type: String, default: "Active", enum: status_enum }
}, {
    timestamps: true, versionKey: false
})

module.exports = mongoose.model('banner', BannerSchema)