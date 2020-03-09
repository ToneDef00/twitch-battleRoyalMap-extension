const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request        = require('request');
const config   = require("../config");
const moment      = require('moment');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = config.clientId;
const TWITCH_SECRET    = config.clientSecret;
const SESSION_SECRET   = config.secret;
const CALLBACK_URL     = 'http://localhost:3001/auth/twitch/callback';  // You can run locally with - http://localhost:3000/auth/twitch/callback


// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  let options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, async function (error, response, body) {
    if (response && response.statusCode == 200) {

      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



passport.use("twitch", new OAuth2Strategy({
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_SECRET,
      callbackURL: CALLBACK_URL,
      state: true
    },
    async function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      // console.log(profile)
      console.log(` Oauth2Strategy data storage callback function time`+ moment().unix()+"");
      //try and store user data in mongodb
      //     try{
      //         let isUser = await User.find({email:profile.data[0].email})
      //         console.log(`is user is ================================================
      //     =========== ${isUser} =======================================================`);
      //         if(isUser == " " || isUser == ""||isUser == null) {
      //             let newUser = await User.create({
      //                 email: profile.data[0].email,
      //                 username: profile.data[0].display_name,
      //                 profileImg: profile.data[0].profile_image_url,
      //                 view_count: profile.view_count,
      //                 accessToken: profile.accessToken,
      //                 refreshToken: profile.refreshToken
      //             });
      //             console.log(newUser);
      //             logger.log({
      //                 level: 'info',
      //                 message: "LOGGING NEW USER unixTime:"+ moment().unix() + " "+JSON.stringify(newUser)
      //             });
      //         }else{
      //             logger.log({
      //                 level: 'info',
      //                 message: "LOGGING USER at UnixTime:" + moment().unix()+ " "+JSON.stringify(isUser)
      //             });
      //         }
      //
      //     }catch(err){
      //         console.log(err)
      //     }

      done(null, profile);
    }
));


// By default passport wants to make a cookie based authentication for the user
// in our case, we are using tokens so we set this to false
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

//twitch authentication
const oAuthLogin = passport.authenticate("twitch", { scope: 'user:read:email' });
const oAuthRedirect = passport.authenticate("twitch", { successRedirect: 'http://localhost:3000/auth/success', failureRedirect: '/' });

module.exports = {
  requireAuth,
  requireSignIn,
  oAuthLogin,
  oAuthRedirect
};