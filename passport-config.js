const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {

  	var user = "not found";
	await User.findOne({email: email}).lean().then((res) => { user = res;});

    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async (id, done) => {
  	var returnUser;
  	await User.findOne({_id: id}).lean().then((res) => { returnUser = res;});
    return done(null, returnUser)
  })
}

module.exports = initialize