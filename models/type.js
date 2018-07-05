const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const typeSchema = new Schema ({
    type_name: {type: String, require: true, unique: true },
    status: {type: Number},
    created_at: {type: Date, default: Date.now() }
});
module.exports = mongoose.model("Type", typeSchema);