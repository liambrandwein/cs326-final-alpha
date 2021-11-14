
// const uri =
//   "mongodb+srv://admin:GLuoPTN8eB3eA5Xc@326-final-alpha.juhom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// DELETE LATER ^^^^^^
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");



// Function to connect to the server (mquery is the mongo query to write
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
//EXPORT THIS: run().catch(console.dir);
// Remember: must call functions in the run function
async function createAcc(client, req, res) {
    const body = req.body;
    // Schema is { 'id': 'password (hashed)' }
    const email = body.id;
    const checkResult = await client.db("watchalldata").collection("userdata").findOne({'id': email});
    // Checks if the email exists
    if (checkResult) {
        return 0;
    }
    const pass = await bcrypt.hash(body.pass, 1);
    const obj = {};
    obj['id'] = email;
    obj['password'] = pass;
    const result = await client.db("watchalldata").collection("userdata").insertOne(obj);
    
    return result;
}

async function addSub(client, req, res) {
    // V TODO: FINISH THIS LATER V
}

async function removeSub(client, req, res) {

}

async function updateHist(client, req, res) {

}

async function clearHist(client, req, res) {

}
// API GETTERS
async function getCreator(client, req, res) {

}

async function getAllCreator(client, req, res) {

}

async function getUser(client, req, res) {
    const email = req.params.id;
    const checkResult = await client.db("watchalldata").collection("userdata").findOne({'id': email});

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

}

async function getHist(client, req, res) {
    
}

module.exports = {
    run,
    createAcc,
    addSub,
    removeSub,
    updateHist,
    clearHist,
    getCreator,
    getAllCreator,
    getUser,
    getSubs,
    getHist
}