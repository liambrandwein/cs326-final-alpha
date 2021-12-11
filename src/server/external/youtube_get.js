// https://www.awesomecoding.co/posts/tutorial-using-youtube-javascript-api
const fetch = require("node-fetch");

let YOUTUBE_API_KEY;

if (!process.env.YOUTUBEKEY) {
    let secrets = require('../secrets.json');
    YOUTUBE_API_KEY = secrets.youtubekey;
} else {
    YOUTUBE_API_KEY = process.env.YOUTUBEKEY;
}



async function youtubeSearch(query, resultsPerPage, pageToken) {
    console.log("Ready to get Youtube data!");
    let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${query}`;
    if (resultsPerPage) {
        url = `${url}&maxResults=${resultsPerPage}`;
    }
    if (pageToken) {
        url = `${url}&pageToken=${pageToken}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

module.exports = {
    youtubeSearch,
};