const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    login_type: {type: String},
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true },
    password: { type: String},
    avatar: { type: String },
    google_id: {type: String},
    google_token: {type: String},
    google_name: {type:String},
    instagramId: {type:String},
    instagram_name: {type:String},
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('User', userSchema);