'use strict';
let fs = require('fs');
let mongodb = require('mongodb');
let mongoserver = require('./mongoserver');
let bcrypt = require('bcrypt');
let twitch = require('./external/twitch_get')
let youtube = require('./external/youtube_get')
// DELETE AFTER MIGRATION TO MONGODB:
function getDataBase(data_type) {
    const supported_data_types = ['user_data', 'creator_data',
        'user_watch_hist_data', 'user_sub_data'];
    if (!data_type in supported_data_types) {
        console.alert("BUG: data not supported");
        return {};
    }
    const filename = 'src/server/data/' + data_type + '.json';
    // Add if file exists
    const str = fs.readFileSync(filename, { encoding: 'utf8' });
    return JSON.parse(str);
}
// DELETE AFTER MIGRATION TO MONGODB:
// verify if user's supplied account and password match the data in the database
function loginAccount(req, res) {
    const user_data = getDataBase('user_data');
    const body = req.body;
    if (body.id in user_data || user_data[body.id] === body.pass) {
        res.status(200).send({
            status: 'success',
            id: body.id,
            pass: body.pass,
            msg: 'login success'
        });
    }
    else {
        res.status(400).send({
            status: 'fail',
            msg: 'login fail'
        });
    }
}
// DELETE AFTER MIGRATION TO MONGODB:
// check if user's account is already in the database. 
function checkAccountExist(req) {
    const user_data = getDataBase('user_data');
    const body = req.body;
    return body.id in user_data;
}
// check if new account can be created
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

// TODO: Update this to use the mongoserver.js function 'updateHist'
function updateWatchHist(req, res) {
    const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const body = req.body;
    if (body.id in user_watch_hist_data) {
        user_watch_hist_data[body.id].push(body.creator_id);
    }
    else {
        user_watch_hist_data[body.id] = Array(body.creator_id);
    }
    fs.writeFileSync('src/server/data/user_watch_hist_data.json', JSON.stringify(user_watch_hist_data));
    res.status(200).send({
        status: 'success',
        msg: 'update watch hist success'
    });
}

// TODO: Update this to use the mongoserver.js function 'clearHist'
function clearWatchHist(req, res) {
    const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const body = req.body;
    if (body.id in user_watch_hist_data) {
        user_watch_hist_data[body.id] = [];
    }
    fs.writeFileSync('src/server/data/user_watch_hist_data.json', JSON.stringify(user_watch_hist_data));
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

function getUserWatchHist(req, res) {
    const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const body = req.body;
    const params = req.params;
    if (params.id in user_watch_hist_data) {
        res.send({
            user_id: params.id,
            history: user_watch_hist_data[params.id]
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

function getAllCreatorData(req, res) {
    const creator_data = getDataBase('creator_data');
    res.status(200).send(creator_data);
}

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
module.exports = {
    getDataBase,
    loginAccount,
    checkAccountExist,
    createAccount,
    addUserSub,
    removeUserSub,
    updateWatchHist,
    clearWatchHist,
    addCreator,
    getUserData,
    getUserSubData,
    getUserWatchHist,
    getCreatorData,
    getAllCreatorData,
    getTwitchSearchResults,
    getYoutubeSearchResults
}