import { watch } from './utils.js';


const TWITCH_RESULT_LIMIT = 10;
const YOUTUBE_RESULT_LIMIT = 10;


// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}



async function subscribe(i, data) {

	const response = await fetch('/addusersub', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ id: window.localStorage.getItem('username'), creator_id: data[i].channel_name })
	});
}

function pageLoad() {
	let query = window.location.hash;
	if (query) {
		// throw away the first character (the #)
		query = query.substring(1);
	}
	retrieveResults(query);
}

async function retrieveResults(query) {


	// get twitch results
	const url_twitch = '/getTwitchSearchResults/' + query;
	const response_twitch = await fetch(url_twitch);
	let data_twitch = await response_twitch.json();
	// only take the first TWITCH_RESULT_LIMIT results
	data_twitch = data_twitch.slice(0, TWITCH_RESULT_LIMIT);


	// get youtube results
	const url_youtube = '/getYoutubeSearchResults/' + query;
	const response_youtube = await fetch(url_youtube);
	let data_youtube = await response_youtube.json();
	data_youtube = data_youtube.slice(0, YOUTUBE_RESULT_LIMIT);


	// append all results to a single array
	let results = data_twitch.concat(data_youtube);
	// shuffle the results
	results = shuffle(results);



	for (let i = 0; i < results.length; i++) {
		const elt = results[i];
		const profile_pic = elt.profile_pic;
		const channel_name = elt.channel_name;
		const platform = elt.platform;
		const url = elt.url;

		const res = await fetch('/addcreator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				name: results[i].channel_name,
				id: results[i].channel_name,
				platform: results[i].platform,
				url: results[i].url,
				thumbnail: results[i].profile_pic
			})
		});


		let div = `
    <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${profile_pic}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${channel_name}</h5>
                <p class="card-text">${platform}</p>
                <p class="card-text"><small class="text-muted">Live now</small></p>
                <a id="search-watch-${channel_name}" href="${url}" class="btn btn-primary">Watch now</a>
                <a class="btn btn-success" id="sub-${i}">Subscribe</a>
              </div>
            </div>
          </div>
        </div>
    `;
		document.getElementById('search-cards').insertAdjacentHTML('beforeend', div);
		document.getElementById(`sub-${i}`).addEventListener('click', () => subscribe(i, results));
		document.getElementById(`search-watch-${channel_name}`).addEventListener('click', () => watch(channel_name));
	}


}


pageLoad();