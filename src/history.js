import { watch } from './utils.js';

async function loadHistory() {
    // const email = window.localStorage.getItem('username');
    const check = await fetch('/auth');
    const checkResponse = await check.json();
    if (checkResponse.hasOwnProperty('Error')) {
        window.location.href = './signin';
    }
    const url = '/getuserwatchhist/' + 'placeholder';
    const response = await fetch(url);
    const data = await response.json();
    const history = data.history;



    // display the history
    for (let i = 0; i < history.length; i++) {
        const creator_id = history[i];

        // query creator's data
        const creator_url = '/getcreatordata/' + creator_id;

        const creator_response = await fetch(creator_url);
        const creator_data = await creator_response.json();

        const pic = creator_data.thumbnail;
        const last_watch = data.watch_times[i];
        const platform = creator_data['data'][0].platform;
        const platform_url = creator_data['data'][0].url;

        const div =
            `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
        <div class="col-md-4">
            <img src="${pic}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
            <h5 class="card-title"> ${creator_id}</h5>
            <p class="card-text">${platform}</p>
            <p class="card-text"><small class="text-muted">Last watched: ${last_watch}</small></p>
            <a id="hist-watch-${creator_id}" href="${platform_url}" class="btn btn-primary">Watch again</a>
            </div>
        </div>
        </div>
    </div>`;
        document.getElementById('history-cards').insertAdjacentHTML('beforeend', div);
        document.getElementById(`hist-watch-${creator_id}`).addEventListener('click', () => watch(creator_id));
    }

}

async function clearHistory() {

    const url = '/clearwatchhist/'
    const user_id = window.localStorage.getItem('username');
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ id: user_id })
    });

    // reload the page
    window.location.reload();
}


loadHistory();
const createBtn = document.getElementById('clear-history');
createBtn.addEventListener('click', clearHistory);
