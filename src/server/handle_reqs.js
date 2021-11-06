'use strict';
import { createRequire } from 'module';
let fs = require('fs');

function getDataBase(data_type){
    const supported_data_types = ['user_data', 'creator_data', 
                                'user_watch_hist_data', 'user_sub_data' ];
    if (data_type in supported_data_types){
        console.alert("BUG: data not supported");
        return {};
    }
    const filename = './data/' + data_type + '.json';
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
        fs.writeFileSync('./data/user_data.json', JSON.stringify(user_data));
        res.send({
            status: 'success',
            msg: 'create account success'
        });
    }
}