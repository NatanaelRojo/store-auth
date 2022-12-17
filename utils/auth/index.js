const passport = require('passport');
const LocalStrategy = require('./local.strategy');

passport.use(LocalStrategy);
