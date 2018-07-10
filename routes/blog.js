const router = require('express').Router();
const passport = require('passport');

router.get('/admin/blog', (req,res) => {
    res.render("admin/blog/listings", {layout: "admin/admin_dashboard"});
});
router.get('/admin/add-blog', (req,res) => {
    res.render("admin/blog/add_blog_view", {layout: "admin/admin_dashboard"});
});

module.exports = router;