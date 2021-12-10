const express = require('express');
const handle = require('./handle_reqs');
// // authentication stuff v *copied from class
// const expressSession = require('express-session');  // for managing session state
// const passport = require('passport');               // handles authentication
// const LocalStrategy = require('passport-local').Strategy; // username/password strategy
// // authentication stuff ^
const app = express();
const PORT = 8080;

// // Session configuration

// const session = {
//     secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
//     resave : false,
//     saveUninitialized: false
// };

// // Passport configuration
// // TODO: fix this

// const strategy = new LocalStrategy(
//     async (username, password, done) => {
// 	// if (!findUser(username)) {
// 	//     // no such user
// 	//     return done(null, false, { 'message' : 'Wrong username' });
// 	// }
// 	if (!validatePassword(username, password)) {
// 	    // invalid password
// 	    // should disable logins after N messages
// 	    // delay return to rate-limit brute-force attacks
// 	    await new Promise((r) => setTimeout(r, 2000)); // two second delay
// 	    return done(null, false, { 'message' : 'Wrong password' });
// 	}
// 	// success!
// 	// should create a user object here, associated with a unique identifier
// 	return done(null, username);
//     });

app.use(express.json());

app.use(express.static('src'));

app.listen(
    process.env.PORT || PORT,
    () => console.log('server up!')
);

// STATIC HTML:

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src' });
});

app.get('/history', (req, res) => {
    res.sendFile('history.html', { root: 'src' });
});

app.get('/subscription', (req, res) => {
    res.sendFile('manager.html', { root: 'src' });
});

app.get('/signin', (req, res) => {
    res.sendFile('signin.html', { root: 'src' });
});

app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: 'src' });
});

app.get('/results', (req, res) => {
    res.sendFile('searchResult.html', { root: 'src' });
})

// CRUD (no read)

app.post('/createaccount', handle.createAccount);

app.post('/addusersub', handle.addUserSub);

app.delete('/removeusersub', handle.removeUserSub);

app.patch('/updatewatchhist', handle.updateWatchHist);

app.delete('/clearwatchhist', handle.clearWatchHist);

app.post('/addcreator', handle.addCreator);

// API GETTERS (read)

app.get('/getuserdata/:id/:password', handle.getUserData);

app.get('/getusersubdata/:id', handle.getUserSubData);

app.get('/getuserwatchhist/:id', handle.getUserWatchHist);

app.get('/getcreatordata/:id', handle.getCreatorData);
// This version gets all the creator data
// app.get('/getallcreatordata', handle.getAllCreatorData);

// get search results
app.get('/getTwitchSearchResults/:query', handle.getTwitchSearchResults);
app.get('/getYoutubeSearchResults/:query', handle.getYoutubeSearchResults);
