const router = require('express').Router();
const type = require("../models/type");

router.get('/admin/blog', (req,res) => {
    res.render("admin/blog/listings", {layout: "admin/admin_dashboard"});
});

router.get('/admin/add-blog', (req,res) => {
    type.find({
        status: 1
    }).then(result => {
        res.render("admin/blog/add_blog_view", {layout: "admin/admin_dashboard", all_categories:result});
    });
});

router.post('/admin/add-blog-details', (req,res) => {
    console.log(req);
});

module.exports = router;