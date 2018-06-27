const express = require('express');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

const db = require('./config/db').mongoURI;
const port = process.env.PORT || 5000;

const handlebars = require('handlebars');
const layouts = require('handlebars-layouts');
handlebars.registerHelper(layouts(handlebars));

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
}
else {
    next();
}
};
app.use(allowCrossDomain);


mongoose
    .connect(db)
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

require('./config/passport')(passport);
//include router//
const indexRoute = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var hbs = exphbs.create({
    extname: '.hbs', //we will be creating this layout shortly
    helpers: {
        if_eq: function (a, b, opts) {
          if (a == b) // Or === depending on your needs
            return opts.fn(this);
          else
            return opts.inverse(this);
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: "xbBzCElklLCf7KKimO482mN7z3TGOz0Z",
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: "/admin",
    maxAge: 1800000
  },
  name: "id", 
  ttl: (1* 60* 60)
}));

app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(indexRoute);


app.listen(port, () => console.log(`Server connected to ${port}`));

module.exports = app;


