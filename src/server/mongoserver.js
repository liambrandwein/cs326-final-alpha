
// DELETE LATER ^^^^^^
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");



// Function to connect to the server (mQuery is the function passed to this
// function in handle_reqs.js. To get data from the MongoDB Atlas server in 
// handle_reqs.js, do 'await mongoserver.run(mongoserver.[mQuery], req, res)'
async function run(mQuery, req, res) {
    let secrets;
    let pass;
    if (!process.env.PASSWORD) {
        secrets = require('./secrets.json');
        pass = secrets.password;
    } else {
        pass = process.env.PASSWORD;
    }

    // Replace the following with values for your environment.
    const username = encodeURIComponent("admin");
    const password = encodeURIComponent(pass);
    const clusterUrl = "326-final-alpha.juhom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    // Replace the following with your MongoDB deployment's connection string.
    const uri =
        `mongodb+srv://${username}:${password}@${clusterUrl}`;

    // Create a new MongoClient
    const client = new MongoClient(uri);

    let result;
    try {
        // Connect the client to the server
        await client.connect();
        // to allow function to retrieve result
        result = await mQuery(client, req, res);
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return result
    }
}

// Remember: must pass function names to the run function mQuery parameter
// Old schema (user_data.json): { 'email': 'password' }
// New schema (userdata collection): { 'id': 'email', 'password': 'password' }
async function createAcc(client, req, res) {
    const body = req.body;

    const email = body.id;
    const checkResult = await client.db("watchalldata").collection("userdata").findOne({ 'id': email });
    // Checks if the email exists
    if (checkResult) {
        return 0;
    }
    const pass = await bcrypt.hash(body.pass, 1);
    const obj = {};
    obj['id'] = email;
    obj['password'] = pass;
    // userdata
    const result = await client.db("watchalldata").collection("userdata").insertOne(obj);
    // usersubdata
    const obj2 = {};
    obj2['id'] = email;
    obj2['creators'] = [];
    const result2 = await client.db("watchalldata").collection("usersubdata").insertOne(obj2);
    // userwatchhist
    const obj3 = {};
    obj3['id'] = email;
    obj3['creators'] = [];
    const result3 = await client.db("watchalldata").collection("userwatchhistdata").insertOne(obj3);

    return result;
}

// Old schema (user_sub_data.json): { 'email': ['creator name', 'creator name',...]}
// New schema (usersubdata collection): { 'id': 'email', 'creators': ['creator name', 'creator name',...]}
async function addSub(client, req, res) {
    const body = req.body;

    const email = body.id;
    const checkResult = await client.db("watchalldata").collection("usersubdata").findOne({ 'id': email });

    if (!checkResult || checkResult.creators.includes(body.creator_id)) {
        return 0;
    }

    const result = await client.db("watchalldata").collection("usersubdata").updateOne({ 'id': email }, { '$push': { 'creators': body.creator_id } });

    if (!result) {
        return 0;
    }

    return result;
}

async function removeSub(client, req, res) {
    const body = req.body;

    const email = body.user_id;
    const checkResult = await client.db("watchalldata").collection("usersubdata").findOne({ 'id': email });
    if (!checkResult || !checkResult.creators.includes(body.creator_id)) {
        return 0;
    }

    const result = await client.db("watchalldata").collection("usersubdata").updateOne({ 'id': email }, { '$pull': { 'creators': body.creator_id } });

    if (!result) {
        return 0;
    }

    return result;
}
// TODO: 
// Old schema (user_watch_hist_data.json): { 'email': ['creator name', 'creator name',...]}
// New schema (userwatchhistdata collection, very similar to usersubdata): { 'id': 'email', 'creators': ['creator name', 'creator name',...]}
async function updateHist(client, req, res) {
    const body = req.body;

    const email = body.id;
    const checkResult = await client.db("watchalldata").collection("userwatchhistdata").findOne({ 'id': email });

    if (!checkResult || checkResult.creators.includes(body.creator_id)) {
        return 0;
    }

    const result = await client.db("watchalldata").collection("userwatchhistdata").updateOne({ 'id': email }, { '$push': { 'creators': body.creator_id } });

    if (!result) {
        return 0;
    }

    return result;
}
// TODO:
async function clearHist(client, req, res) {
    const body = req.body;
    const email = body.id;
    const checkResult = await client.db("watchalldata").collection("userwatchhistdata").findOne({ 'id': email });

    if (!checkResult || checkResult.creators.includes(body.creator_id)) {
        // already not in history database
        return 0;
    }
    // set history array to empty
    const result = await client.db("watchalldata").collection("userwatchhistdata").updateOne({ 'id': email }, { '$set': { 'creators': [] } });
    return result;
}
// API GETTERS

// NOTE: deprecated. We're not creating creator_data.json anymore.
// Old schema (creator_data.json): { 'creator name': { 'data': [{ 'platform': 'platform name', 'url': 'url'},...] } }
// New schema (creatordata collection): { 'name': 'creator name', 'id': 'creator id', 'data': [{ 'platform': 'platform name', 'url': 'url'},...], 'thumbnail': 'thumbnail url' }
// async function getCreator(client, req, res) {

// }
// // TODO:
// async function getAllCreator(client, req, res) {

// }
// TODO (this is for addCreator in handle_reqs.js):
async function addCreate(client, req, res) {
    const body = req.body;

    const name = body.name;
    const id = body.id;

    const checkResult = await client.db("watchalldata").collection("creatordata").findOne({'id': id});

    if (checkResult) {
        return 0;
    }

    const platform = body.platform;
    const url = body.url;
    const thumbnail = body.thumbnail

    const obj = {
        name: name,
        id: id,
        data: Array({ platform: platform, url: url }),
        thumbnail: thumbnail
    };

    const result = await client.db("watchalldata").collection("creatordata").insertOne(obj);

    return result;
}
// DONE
// TODO: Update get creator function with new schema
async function getCreator(client, req, res) {
    const id = req.params.id;
    console.log(id);
    const checkResult = await client.db("watchalldata").collection("creatordata").findOne({'id': id});

    if (!checkResult) {
        return 0;
    }

    return checkResult;
}
// DONE
async function getUser(client, req, res) {
    const email = req.params.id;
    const checkResult = await client.db("watchalldata").collection("userdata").findOne({ 'id': email });

    if (!checkResult) {
        return 0;
    }
    const obj = {
        id: checkResult.id,
        password: checkResult.password
    };
    return obj
}

async function getSubs(client, req, res) {
    const params = req.params;
    const email = params.id
    const checkResult = await client.db("watchalldata").collection("usersubdata").findOne({ 'id': email });

    if (!checkResult) {
        return 0;
    }

    return checkResult;
}
// TODO:
async function getHist(client, req, res) {
    const body = req.body;
    const email = body.id;
    // set history array to empty
    const results = await client.db('watchalldata').collection("userwatchhistdata").findOne({ 'id': email }).toArray();
    return results;
}

module.exports = {
    run,
    createAcc,
    addSub,
    removeSub,
    updateHist,
    clearHist,
    addCreate,
    getCreator,
    getUser,
    getSubs,
    getHist
}