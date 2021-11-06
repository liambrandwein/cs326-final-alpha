'use strict';
let fs = require('fs');

function getDataBase(data_type){
    const supported_data_types = ['user_data', 'creator_data', 
                                'user_watch_hist_data', 'user_sub_data' ];
    if (!data_type in supported_data_types){
        console.alert("BUG: data not supported");
        return {};
    }
    const filename = 'src/server/data/' + data_type + '.json';
    // Add if file exists
    const str = fs.readFileSync(filename, { encoding: 'utf8' });
    return JSON.parse(str);
}

// verify if user's supplied account and password match the data in the database
function loginAccount(req, res){
    const user_data = getDataBase('user_data');
    const body = req.body;
    if (body.id  in user_data || user_data[body.id] === body.pass){
        res.send({
            status: 'success',
            id: body.id,
            pass: body.pass,
            msg: 'login success'
        });
    }
    else{
        res.send({
            status: 'fail',
            msg: 'login fail'
        });
    }
}

// check if user's account is already in the database. 
function checkAccountExist(req){
    const user_data = getDataBase('user_data');
    const body = req.body;
    return body.id in user_data;
}
// check if new account can be created
function createAccount(req, res){
    const user_data = getDataBase('user_data');
    const body = req.body;
    if (checkAccountExist(req)){
        res.send({
            status: 'fail',
            msg: 'account already exist'
        });
    }
    else{
        user_data[body.id] = body.pass;
        fs.writeFileSync('src/server/data/user_data.json', JSON.stringify(user_data));
        res.send({
            status: 'success',
            msg: 'create account success'
        });
    }
}

// add a new creator to the user's sub list
function addUserSub(req, res){
    const user_sub_data = getDataBase('user_sub_data');
    const body = req.body;
    if (body.id in user_sub_data){
        user_sub_data[body.id].push(body.creator_id);
    }
    else {
        user_sub_data[body.id] = Array(body.creator_id);
    }
    fs.writeFileSync('src/server/data/user_sub_data.json', JSON.stringify(user_sub_data));
    res.send({
        status: 'success',
        msg: 'add sub success'
    });
}

// remove a creator from the user's sub list
// user_sub_data[id] = set
function removeUserSub(req, res){
    const user_sub_data = getDataBase('user_sub_data');
    const body = req.body;
    if (body.id in user_sub_data){
        user_sub_data[id].delete(body.sub_id);
        res.send({
            status: 'success',
            msg: 'delete sub success'
        });
    }
    else{
        res.send({
            status: 'fail',
            msg: 'user_sub_data[id] does not exist. Delete creator is NULL.'
        });
    }
    fs.writeFileSync('src/server/data/user_sub_data.json', JSON.stringify(user_sub_data));
}

function updateWatchHist(req, res){
    const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const body = req.body;
    if (body.id in user_watch_hist_data){
        user_watch_hist_data[id].push(body.creator_id);
    }
    else{
        user_watch_hist_data[id] = [body.creator_id];
    }
    fs.writeFileSync('src/server/data/user_watch_hist_data.json', JSON.stringify(user_watch_hist_data));
    res.send({
        status: 'success',
        msg: 'update watch hist success'
    });
}

function clearWatchHist(req, res){
    const user_watch_hist_data = getDataBase('user_watch_hist_data');
    const body = req.body;
    if (body.id in user_watch_hist_data){
        user_watch_hist_data[id] = [];
    }
    fs.writeFileSync('src/server/data/user_watch_hist_data.json', JSON.stringify(user_watch_hist_data));
    res.send({
        status: 'success',
        msg: 'clear watch hist success'
    });
}
// creator_data[creator_id] = [ {platform: ..., url: ...}, ...]
function addCreator(req, res){
    const creator_data = getDataBase('creator_data');
    const body = req.body;
    if (body.creator_id in creator_data){
        creator_data[body.creator_id].add({'platform': body.platform, 'url': body.url});
    }
    else{
        creator_data[body.creator_id] = new Set([{'platform': body.platform, 'url': body.url}]);
    }
    fs.writeFileSync('src/server/data/creator_data.json', JSON.stringify(creator_data));
    res.send({
        status: 'success',
        msg: 'add creator success'
    });
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
    addCreator
}