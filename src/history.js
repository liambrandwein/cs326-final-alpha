
async function loadHistory() {
    const email = window.localStorage.getItem('username');
    const url = '/getuserwatchhist/' + email;
    const response = await fetch(url);
    const data = await response.json();
    const history = data.history;
    console.log("loadHist data");
    console.log(data);

    // display the history
    for (let i = 0; i < history.length; i++) {
        const creator_id = history[i];
        console.log("creator_id " + creator_id);
        // query creator's data
        const creator_url = '/getcreatordata/' + creator_id;
        console.log(creator_url);
        const creator_response = await fetch(creator_url);
        const creator_data = await creator_response.json();
        console.log(creator_data);
        const pic = creator_data.thumbnail;
        const last_watch = history[i]['last_watch'];
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
            <p class="card-text"><small class="text-muted">Last watched ${last_watch}</small></p>
            </div>
        </div>
        </div>
    </div>`;
        document.getElementById('history-cards').insertAdjacentHTML('beforeend', div);
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
