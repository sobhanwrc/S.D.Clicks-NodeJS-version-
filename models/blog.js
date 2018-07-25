const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    blog_header_name : {type : String},
    blog_description : {type : String},
    blog_category : { type: Schema.Types.ObjectId, ref: 'Type' },
    blog_banner_image : {type : String},
    blog_image : {type : String},
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Blog', blogSchema);