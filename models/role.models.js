const mongoose = require('mongoose')
const bool_val = [true, false]
const status_enum = ["Active", "Inactive"]


const RoleSchema = mongoose.Schema({
    role_display_name: { type: String, require: true },
    role_group: { type: String, require: true },
    isDeleted: { type: Boolean, default: false, enum: bool_val },
    status: { type: String, default: "Active", enum: status_enum }

}, {
    timestamps: true, versionKey: false

})
module.exports = mongoose.model('role', RoleSchema)