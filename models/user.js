const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true },
    password: { type: String},
    avatar: { type: String },
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('User', userSchema);