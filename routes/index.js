const router = require('express').Router();
const passport = require('passport');
const gravatar = require('gravatar');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const csrf = require('csurf');

var csrfProtection = csrf({ cookie: true })

router.get('/admin', csrfProtection ,(req, res) => {
    var msg = req.flash('loginMessage')[0];
    res.render('admin_login_body',{layout: 'admin/admin_login_view', csrfToken: req.csrfToken(), message: msg});
}).post('/admin', csrfProtection, passport.authenticate('local-login', {
    successRedirect : '/admin/dashboard',
    failureRedirect: '/admin',
    failureFlash: true
}), (req, res) => {
    
});

router.get("/admin/dashboard", (req, res) => {
    res.render('admin/dashboard', {layout:"admin/admin_dashboard"});
});

router.get('/admin/profile', (req,res) => {
    res.render('admin/profile', {layout:"admin/admin_dashboard"});
});

router.get('/admin/logout', (req, res) => {
    req.logout();
    res.redirect('/admin');
});

//for add to monogo db 
router.get('/add-admin', (req, res) => {
    const avatar = gravatar.url("sobhan@wrctpl.com", {s: '200', r: 'pg', d: '404'});
    const user = new User({
        first_name: "Sobhan",
        last_name: "Das",
        email: "sobhan@wrctpl.com",
        password: bCrypt.hashSync("sobhan123"),
        avatar
    });
    user.save();
    res.send("Added successfully");
});

module.exports = router;