// https://d-fischer.github.io/twitch/docs/basic-usage/getting-started.html
// need to run npm install twitch
const { ApiClient } = require('twitch');
const { StaticAuthProvider } = require('twitch-auth');

let clientId;
let accessToken;
let secrets;

if (!process.env.TWITCHID) {
	secrets = require('../secrets.json');
	clientId = secrets.twitchid;
} else {
	clientId = process.env.TWITCHID;
}

if (!process.env.TWITCHKEY) {
	secrets = require('../secrets.json');
	accessToken = secrets.twitchkey;
} else {
	accessToken = process.env.TWITCHKEY;
}

const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });

async function isStreamLive(userName) {
	const user = await apiClient.helix.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	const data = await apiClient.helix.streams.getStreamByUserId(user.id) !== null;

}

// isStreamLive('chess');

async function twitchSearch(query) {
	// const channels = await apiClient.helix.search.searchChannels('pear');
	let channels = await apiClient.helix.search.searchChannels(query);
	return channels['data'];
}

module.exports = {
	twitchSearch,
	isStreamLive
};

