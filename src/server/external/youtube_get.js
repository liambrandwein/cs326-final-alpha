// https://www.awesomecoding.co/posts/tutorial-using-youtube-javascript-api
const fetch = require("node-fetch");

const YOUTUBE_API_KEY = "AIzaSyDujbVSL0llLBvH0NW4f2EFywgAz1t_4BA";



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