const router = require('express').Router();
const passport = require('passport');
const gravatar = require('gravatar');
const bCrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const Type = require('../models/type');
const settings = require('../models/settings_list');
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



// =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    router.get('/admin/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/admin/callback/google',passport.authenticate('google', {
        // successRedirect : '/profile',
        failureRedirect : '/'
    }), function (req,res) {
        console.log(req.user, "after add in monogo db");
        res.redirect("/admin/dashboard");
    });
    //end

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



//for type of category
router.get('/admin/all-types-listings', async (req,res) => {
    var all_type_details = await Type.find({ 
        status: 1
    });
    res.render("admin/type/type_listings", {layout: "admin/admin_dashboard", type_details: all_type_details});
});
router.post('/admin/add-type', (req,res) => {
    const type_add = new Type ({
        type_name: req.body.type,
        status: 1
    });
    if(type_add.save()){
        res.json({
            status: true,
            msg: "Type added successfully."
        });
    }
});
router.post("/admin/fetch-type-details", async (req,res) => {
    var details = await Type.findOne({
        _id: req.body.id
    });
    res.json({
        data: details
    });
});
router.post('/admin/edit-type-change', (req,res) => {
    Type.updateOne({ 
        _id: req.body.id //matching with table id
    },
    { 
        $set:{ 
            type_name: req.body.type
        } 
    }).then(function(result) {
        if(result){
            res.json({
                status: true,
                msg: "Type name edit successfully."
            });
        }
    });  
});
router.post("/admin/type-delete", (req,res) => {
    Type.updateOne({
        _id: req.body.id
    },{
        $set:{
            status: 2
        }
    }).then(function (result) {
        if(result) {
            res.json({
                status: true,
                msg: "Type deleted successfully."
            });
        }
    });
});
//end

//for settings
router.get('/admin/settings', async (req,res) => {
    var all_setings_data = await settings.find();
    res.render('admin/settings/settings', {layout: "admin/admin_dashboard", settings_data:all_setings_data[0]});
});
router.post("/admin/settings-save", async (req,res) => {
    var if_data_exit = await settings.findOne({
        _id: req.body.settings_row_id
    });

    if(Object.keys(if_data_exit).length > 0) {
        settings.updateOne({
            _id: req.body.settings_row_id
        },{
            $set: {
                about_me: req.body.about_us,
                phone_number: req.body.phone,
                email: req.body.my_email,
                fb_id: req.body.fb_id,
                insta_id: req.body.insta_id
            }
        }).then(function (result) {
            if(result){
                res.json({
                    status: true,
                    msg: "Edit successfully."
                });
            }
        });
    }else{
        var new_add = new settings({
            about_me: req.body.about_us,
            phone_number: req.body.phone,
            email: req.body.my_email,
            fb_id: req.body.fb_id,
            insta_id: req.body.insta_id
        });

        if(new_add.save()){
            res.json({
                status: true,
                msg: "Add successfully."
            });
        }
    }
});
//end

module.exports = router;