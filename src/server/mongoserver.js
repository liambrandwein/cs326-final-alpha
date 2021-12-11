const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const validator = require('email-validator');

// Function to connect to the server (mQuery is the function passed to this
// function. To get data from the MongoDB Atlas server in handle_reqs.js, do
// 'await mongoserver.run(mongoserver.[mQuery], req, res)'
async function run(mQuery, req, res) {
	let secrets;
	let pass;
	if (!process.env.PASSWORD) {
		secrets = require('./secrets.json');
		pass = secrets.password;
	} else {
		pass = process.env.PASSWORD;
	}

	const username = encodeURIComponent('admin');
	const password = encodeURIComponent(pass);
	const clusterUrl = '326-final-alpha.juhom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
	const uri = `mongodb+srv://${username}:${password}@${clusterUrl}`;
	const client = new MongoClient(uri);

	let result;
	try {
		await client.connect();
		result = await mQuery(client, req, res);
		await client.db('admin').command({ ping: 1 });
	} finally {
		await client.close();
		return result;
	}
}

async function createAcc(client, req, res) {
	const body = req.body;

	const email = body.id;
	if (!validator.validate(email)) {
		return 0;
	}

	const checkResult = await client.db('watchalldata').collection('userdata').findOne({ 'id': email });

	if (checkResult) {
		return 0;
	}
	const pass = await bcrypt.hash(body.pass, 1);
	const obj = {};
	obj['id'] = email;
	obj['password'] = pass;

	const result = await client.db('watchalldata').collection('userdata').insertOne(obj);

	const obj2 = {};
	obj2['id'] = email;
	obj2['creators'] = [];
	const result2 = await client.db('watchalldata').collection('usersubdata').insertOne(obj2);

	const obj3 = {};
	obj3['id'] = email;
	obj3['creators'] = [];
	obj3['watch_times'] = [];

	const result3 = await client.db('watchalldata').collection('userwatchhistdata').insertOne(obj3);

	return result;
}

async function addSub(client, req, res) {
	const body = req.body;

	const email = body.id;
	const checkResult = await client.db('watchalldata').collection('usersubdata').findOne({ 'id': email });

	if (!checkResult || checkResult.creators.includes(body.creator_id)) {
		return 0;
	}

	const result = await client.db('watchalldata').collection('usersubdata').updateOne({ 'id': email }, { '$push': { 'creators': body.creator_id } });

	if (!result) {
		return 0;
	}

	return result;
}

async function removeSub(client, req, res) {
	const body = req.body;

	const email = body.user_id;
	const checkResult = await client.db('watchalldata').collection('usersubdata').findOne({ 'id': email });
	if (!checkResult || !checkResult.creators.includes(body.creator_id)) {
		return 0;
	}

	const result = await client.db('watchalldata').collection('usersubdata').updateOne({ 'id': email }, { '$pull': { 'creators': body.creator_id } });

	if (!result) {
		return 0;
	}

	return result;
}

async function updateHist(client, req, res) {
	const body = req.body;

	const email = body.id;
	const last_watch_time = body.last_watch_time;
	const checkResult = await client.db('watchalldata').collection('userwatchhistdata').findOne({ 'id': email });

	if (!checkResult) {
		return 0;
	}
	if (checkResult.creators.includes(body.creator_id)) {
		const index = checkResult.creators.indexOf(body.creator_id);
		const prev_watch_time = checkResult.watch_times[index];
		await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$pull': { 'creators': body.creator_id } });
		await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$pull': { 'watch_times': prev_watch_time } });
	}

	const result = await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$push': { 'creators': body.creator_id } });
	const result2 = await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$push': { 'watch_times': last_watch_time } });


	if (!result) {
		return 0;
	}

	return result;
}

async function clearHist(client, req, res) {
	const body = req.body;
	const email = body.id;
	const checkResult = await client.db('watchalldata').collection('userwatchhistdata').findOne({ 'id': email });

	if (!checkResult || checkResult.creators.includes(body.creator_id)) {
		return 0;
	}

	const result = await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$set': { 'creators': [] } });
	const result2 = await client.db('watchalldata').collection('userwatchhistdata').updateOne({ 'id': email }, { '$set': { 'watch_times': [] } });
	return result;
}

async function addCreate(client, req, res) {
	const body = req.body;

	const name = body.name;
	const id = body.id;

	const checkResult = await client.db('watchalldata').collection('creatordata').findOne({ 'id': id });

	if (checkResult) {
		return 0;
	}

	const platform = body.platform;
	const url = body.url;
	const thumbnail = body.thumbnail;

	const obj = {
		name: name,
		id: id,
		data: Array({ platform: platform, url: url }),
		thumbnail: thumbnail
	};

	const result = await client.db('watchalldata').collection('creatordata').insertOne(obj);

	return result;
}

async function getCreator(client, req, res) {
	const id = req.params.id;
	const checkResult = await client.db('watchalldata').collection('creatordata').findOne({ 'id': id });

	if (!checkResult) {
		return 0;
	}

	return checkResult;
}

async function getUser(client, req, res) {
	const email = req.params.id;
	const checkResult = await client.db('watchalldata').collection('userdata').findOne({ 'id': email });

	if (!checkResult) {
		return 0;
	}
	const obj = {
		id: checkResult.id,
		password: checkResult.password
	};
	return obj;
}

async function getSubs(client, req, res) {
	const params = req.params;
	const email = params.id;
	const checkResult = await client.db('watchalldata').collection('usersubdata').findOne({ 'id': email });

	if (!checkResult) {
		return 0;
	}

	return checkResult;
}
// TODO:
async function getHist(client, req, res) {
	const params = req.params;
	const email = params.id;

	const results = await client.db('watchalldata').collection('userwatchhistdata').findOne({ 'id': email });
	if (!results) {
		return 0;
	}
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
};