const express = require('express');
const mongoserver = require('./mongoserver');
const bcrypt = require('bcrypt');
const twitch = require('./external/twitch_get');
const youtube = require('./external/youtube_get');
const session = require('express-session');
const store = new session.MemoryStore();

const app = express();
const PORT = 8080;

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

async function addUserSub(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.body.id = req.session.user.username;
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

async function removeUserSub(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.body.user_id = req.session.user.username;

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

async function updateWatchHist(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.body.id = req.session.user.username;
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

async function clearWatchHist(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.body.id = req.session.user.username;
    const result = await mongoserver.run(mongoserver.clearHist, req, res);
    res.status(200).send({
        status: 'success',
        msg: 'clear watch hist success'
    });

}

async function addCreator(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
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

async function getUserData(req, res) {
    const user_data = await mongoserver.run(mongoserver.getUser, req, res);
    if (user_data === 0) {
        res.status(404).send({
            Error: 'User not found.'
        });
        return;
    }
    const passMatch = await bcrypt.compare(req.params.password, user_data.password);
    if (!passMatch) {
        res.status(404).send({
            Error: 'User not found.'
        });
    } else {
        req.session.authenticated = true;
        req.session.user = {
            username: req.params.id,
            password: req.params.password
        };
        res.status(200).send({
            user_id: user_data['id'],
            password: user_data['password']
        });
    }
}
async function getUserSubData(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.params.id = req.session.user.username;
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
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
        return;
    }
    req.params.id = req.session.user.username;
    const user_watch_hist_data = await mongoserver.run(mongoserver.getHist, req, res);
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

function getTwitchSearchResults(req, res) {
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

function isAuth(req, res) {
    if (!req.session.authenticated) {
        res.status(401).send({
            'Error': 'Unable to verify authentication'
        });
    } else {
        res.status(200).send({
            'Success': 'Auth verified'
        });
    }
}

function logout(req, res) {
    req.session.authenticated = false;
    res.status(200).send({
        'Success': 'Logout succesful'
    });
}

app.use(express.json());

app.use(express.static('src'));

app.use(session({
    secret: process.env.SECRET || 'SECRET',
    cookie: { maxAge: 300000 },
    saveUninitialized: false,
    store
}));

app.listen(
    process.env.PORT || PORT,
    () => console.log('server up!')
);

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

app.post('/createaccount', createAccount);

app.post('/addusersub', addUserSub);

app.delete('/removeusersub', removeUserSub);

app.patch('/updatewatchhist', updateWatchHist);

app.delete('/clearwatchhist', clearWatchHist);

app.post('/addcreator', addCreator);

app.get('/getuserdata/:id/:password', getUserData);

app.get('/getusersubdata/:id', getUserSubData);

app.get('/getuserwatchhist/:id', getUserWatchHist);

app.get('/getcreatordata/:id', getCreatorData);

app.get('/getTwitchSearchResults/:query', getTwitchSearchResults);

app.get('/getYoutubeSearchResults/:query', getYoutubeSearchResults);

app.get('/auth', isAuth);

app.get('/logout', logout);