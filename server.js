if(process.env.NODE_ENV !== 'production')
{
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
// const users = [];
initializePassport(passport);

const indexRouter = require('./routes/index');
const trainerRouter = require('./routes/trainers');
const linesRouter = require('./routes/lines');
const usersRouter = require('./routes/users');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
//app.use(express.static('public'));
app.use("/public", express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'));

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

app.use('/', indexRouter);
app.use('/trainer', trainerRouter);
app.use('/lines', linesRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000);