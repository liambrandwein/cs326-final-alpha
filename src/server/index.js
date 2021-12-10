const express = require('express');
// const handle = require('./handle_reqs');
// v handle_reqs.js 
let fs = require('fs');
let mongodb = require('mongodb');
let mongoserver = require('./mongoserver');
let bcrypt = require('bcrypt');
let twitch = require('./external/twitch_get');
let youtube = require('./external/youtube_get');
// ^ handle_reqs.js

// // authentication stuff v *copied from class
// const expressSession = require('express-session');  // for managing session state
// const passport = require('passport');               // handles authentication
// const LocalStrategy = require('passport-local').Strategy; // username/password strategy
// // authentication stuff ^
const app = express();
const PORT = 8080;

// v handle_reqs.js 
async function createAccount(req, res) {
    const result = await mongoserver.run(mongoserver.createAcc, req, res);
    if (result === 0) {
        res.status(400).send({
            status: 'fail',
            msg: 'account already exist'
        });
    }
    else {

        res.status(200).send({
            status: 'success',
            msg: 'create account success'
        });
    }
}
// DONE
// TODO: Update this to use the mongoserver.js function 'addSub'
async function addUserSub(req, res) {
    const result = await mongoserver.run(mongoserver.addSub, req, res);
    if (result === 0) {
        res.status(400).send({
            status: 'Fail',
            msg: 'Sub addition failed'
        });
    }
    else {
        res.status(200).send({
            status: 'success',
            msg: 'add sub success'
        });
    }
}

// TODO: Update this to use the mongoserver.js function 'removeSub'
async function removeUserSub(req, res) {
    const user_sub_data = await mongoserver.run(mongoserver.removeSub, req, res);

    if (user_sub_data === 0) {
        res.status(404).send({
            status: 'fail',
            msg: 'user_sub_data[id] does not exist. Delete creator is NULL.'
        });
    }
    else {
        res.status(200).send({
            status: 'success',
            msg: 'delete sub success'
        });
    }
}

// DONE
// Update this to use the mongoserver.js function 'updateHist'
async function updateWatchHist(req, res) {
    const result = await mongoserver.run(mongoserver.updateHist, req, res);
    if (result === 0) {
        res.status(400).send({
            status: 'failure',
            msg: 'creator already in watch history'
        });
    } else {
        res.status(200).send({
            status: 'success',
            msg: 'update watch hist success'
        });
    }
}

// TODO: Update this to use the mongoserver.js function 'clearHist'
async function clearWatchHist(req, res) {
    // const user_watch_hist_data = getDataBase('user_watch_hist_data');
    // const body = req.body;
    // if (body.id in user_watch_hist_data) {
    //     user_watch_hist_data[body.id] = [];
    // }
    // fs.writeFileSync('src/server/data/user_watch_hist_data.json', JSON.stringify(user_watch_hist_data));
    // res.status(200).send({
    //     status: 'success',
    //     msg: 'clear watch hist success'
    // });

    const result = await mongoserver.run(mongoserver.clearHist, req, res);
    res.status(200).send({
        status: 'success',
        msg: 'clear watch hist success'
    });

}


// DONE
// Now it takes a creator name, creator id, platform, url, AND thumbnail url ('thumbnail')
async function addCreator(req, res) {
    const result = await mongoserver.run(mongoserver.addCreate, req, res);

    if (result === 0) {
        res.status(400).send({
            status: 'fail',
            msg: 'creator already exists'
        });
    } else {
        res.status(200).send({
            status: 'success',
            msg: 'add creator success'
        });
    }
}

// API GETTERS (ALL TODO:)
async function getCreatorData(req, res) {
    const result = await mongoserver.run(mongoserver.getCreator, req, res);
    if (result === 0) {
        res.status(404).send({
            Error: 'Creator not found.'
        });
    } else {
        res.status(200).send({
            name: result['name'],
            id: result['id'],
            data: result['data'],
            thumbnail: result['thumbnail']
        });
    }
}

// DONE: This one is done.
async function getUserData(req, res) {
    const user_data = await mongoserver.run(mongoserver.getUser, req, res);
    // Function also checks if password matches
    if (user_data === 0) {
        res.status(404).send({
            Error: 'User not found.'
        });
        return;
    }
    // Compare password to hashed one.
    const passMatch = await bcrypt.compare(req.params.password, user_data.password);
    if (!passMatch) {
        res.status(404).send({
            Error: 'User not found.'
        });
    } else {
        res.status(200).send({
            user_id: user_data['id'],
            password: user_data['password']
        });
    }
}
// DONE
async function getUserSubData(req, res) {
    const user_sub_data = await mongoserver.run(mongoserver.getSubs, req, res);
    const params = req.params;
    if (user_sub_data === 0) {
        res.status(404).send({
            Error: 'User not found.'
        });
    } else {
        res.status(200).send({
            user_id: params.id,
            subs: user_sub_data.creators
        });
    }

}

async function getUserWatchHist(req, res) {
    //const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const user_watch_hist_data = await mongoserver.run(mongoserver.getHist, req, res);
    console.log("userWatchHist");
    console.log(user_watch_hist_data);
    const params = req.params;
    if (user_watch_hist_data) {
        res.send({
            user_id: params.id,
            history: user_watch_hist_data.creators,
            watch_times: user_watch_hist_data.watch_times,
        });
    } else {
        res.send({
            Error: 'User not found.'
        });
    }
}

// function getCreatorData(req, res) {
//     const creator_data = getDataBase('creator_data');
//     const body = req.body;
//     const params = req.params;
//     if (params.id in creator_data) {
//         res.send(creator_data[params.id]);
//     } else {
//         res.send({
//             Error: 'Creator not found.'
//         });
//     }
// }

// function getAllCreatorData(req, res) {
//     const creator_data = getDataBase('creator_data');
//     res.status(200).send(creator_data);
// }

function getTwitchSearchResults(req, res) {
    console.log("getting twitch search")
    twitch.twitchSearch(req.params.query).then(
        (data) => {
            let parsed_data = [];
            for (let i = 0; i < data.length; i++) {
                const elt = data[i];
                parsed_data.push({
                    name: elt.name,
                    channel_id: elt.name,
                    channel_name: elt.name,
                    profile_pic: elt.thumbnailUrl,
                    platform: 'twitch',
                    url: `https://www.twitch.tv/${elt.name}`
                });
            }
            res.status(200).send(JSON.stringify(parsed_data));
        }
    );
}

function getYoutubeSearchResults(req, res) {
    youtube.youtubeSearch(req.params.query, 50).then(
        (data) => {
            data = data['items'];
            let parsed_data = [];
            for (let i = 0; i < data.length; i++) {
                const elt = data[i]
                parsed_data.push({
                    name: elt['snippet'].title,
                    channel_name: elt['snippet']['channelTitle'],
                    channel_id: elt['snippet']['channelId'],
                    profile_pic: elt['snippet']['thumbnails']['high']['url'],
                    platform: 'youtube',
                    url: `https://www.youtube.com/watch?v=${elt['id']['videoId']}`
                });
            }

            res.status(200).send(JSON.stringify(parsed_data));
        }
    );
}
// ^ handle_reqs.js

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

app.post('/createaccount', createAccount);

app.post('/addusersub', addUserSub);

app.delete('/removeusersub', removeUserSub);

app.patch('/updatewatchhist', updateWatchHist);

app.delete('/clearwatchhist', clearWatchHist);

app.post('/addcreator', addCreator);

// API GETTERS (read)

app.get('/getuserdata/:id/:password', getUserData);

app.get('/getusersubdata/:id', getUserSubData);

app.get('/getuserwatchhist/:id', getUserWatchHist);

app.get('/getcreatordata/:id', getCreatorData);
// This version gets all the creator data
// app.get('/getallcreatordata', handle.getAllCreatorData);

// get search results
app.get('/getTwitchSearchResults/:query', getTwitchSearchResults);
app.get('/getYoutubeSearchResults/:query', getYoutubeSearchResults);
