const monogose = require("mongoose");
const Schema = monogose.Schema;

const SettingsSchema = new Schema ({
    about_me: {type: String},
    phone_number: {type: Number},
    email: {type: String},
    fb_id: {type: String},
    insta_id: {type: String},
    name_of_500px: {type: String},
    created_at: {type: Date, default: Date.now()}
});

module.exports = monogose.model("settings_list",SettingsSchema);
