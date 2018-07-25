const router = require('express').Router();
const type = require("../models/type");
const blog = require("../models/blog");

var multer  = require('multer');
var im = require('imagemagick');
var fs = require('fs');

router.get('/admin/blog', async (req,res) => {
    var all_blog_details = await blog.find({}).populate('Type');
    console.log(all_blog_details);
    // return false;
    var all_categories = await type.find({status : 1});

    res.render("admin/blog/listings", {layout: "admin/admin_dashboard", details: all_blog_details, types: all_categories});
});

router.get('/admin/add-blog', (req,res) => {
    type.find({
        status: 1
    }).then(result => {
        res.render("admin/blog/add_blog_view", {layout: "admin/admin_dashboard", all_categories:result});
    });
});


var blog_image_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/blog_image');
    },
    filename: function (req, file, cb) {
      fileExt = file.mimetype.split('/')[1];
      
      fileName = Date.now() + '.' + fileExt;
      cb(null, fileName);
    }
});
var blog_image_upload = multer({ storage: blog_image_storage, limits: {fileSize:3000000} });

router.post('/admin/add-blog-details', blog_image_upload.fields([{
    name: 'blog_banner_image', maxCount: 1
},{
    name: 'blog_image', maxCount: 1
}]), (req,res) => {
    var blog_banner_image, blog_image;

    if (req.files.blog_banner_image && req.files.blog_banner_image.length > 0){
        // save thumbnail -- should this part go elsewhere?
        blog_banner_image = req.files.blog_banner_image[0].filename;
        im.crop({
          srcPath: 'public/blog_image/'+ req.files.blog_banner_image[0].filename,
          dstPath: 'public/blog_image/resize/'+ req.files.blog_banner_image[0].filename,
          width: 1920,
          height: 652
        }, function(err, stdout, stderr){
          if (err) throw err;
          
        });
    }else{
        blog_banner_image = '';
    }

    if (req.files.blog_image && req.files.blog_image.length > 0){
        // save thumbnail -- should this part go elsewhere?
        blog_image = req.files.blog_image[0].filename;
        im.crop({
          srcPath: 'public/blog_image/'+ req.files.blog_image[0].filename,
          dstPath: 'public/blog_image/resize/'+ req.files.blog_image[0].filename,
          width: 1920,
          height: 652
        }, function(err, stdout, stderr){
          if (err) throw err;
          
        });
    }else{
        blog_image = '';
    }

    var blog_insert = new blog({
        blog_header_name : req.body.blog_header_name,
        blog_description : req.body.blog_description,
        blog_category : req.body.blog_category,
        blog_banner_image : blog_banner_image,
        blog_image : blog_image
    });

    if(blog_insert.save()) {
        res.redirect('/admin/add-blog');
    }
});

module.exports = router;