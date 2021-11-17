console.log("search my boy!")

const TWITCH_RESULT_LIMIT = 10;
function pageLoad() {
    let query = window.location.hash;
    if (query) {
        // throw away the first character (the #)
        query = query.substring(1);
    }
    retrieveResults(query);
}

async function retrieveResults(query) {
    console.log("searching for: " + query);
    const url = '/getTwitchSearchResults/' + query;
    const response = await fetch(url);
    let data = await response.json();
    // data = JSON.parse(data);
    console.log(response);


    for (let i = 0; i < Math.min(data.length, TWITCH_RESULT_LIMIT); i++) {
        const profile_pic = data[i].profile_pic;
        const name = data[i].name;
        let div = `
    <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${profile_pic}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">Twitch</p>
                <p class="card-text"><small class="text-muted">Live now</small></p>
                <a href="https://www.twitch.tv/${name}" class="btn btn-primary">Watch now</a>
              </div>
            </div>
          </div>
        </div>
    `;
        document.getElementById('search-cards').insertAdjacentHTML('beforeend', div);
    }


}


pageLoad();