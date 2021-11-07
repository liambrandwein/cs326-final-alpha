
async function loadHistory() {
    const email = window.localStorage.getItem('username');
    const url = '/getuserdata/' + email;
    const response = await fetch(url);
    const data = await response.json();
    const history = data.history;

    for (let i = 0; i < history.length; i++) {
        const creator_id = history[i]['creator_id'];
        // query creator's data
        const creator_url = '/getuserdata/' + creator_id;
        const creator_response = await fetch(creator_url);
        const creator_data = await creator_response.json();
        const pic = creator_data.profile_pic;
        const content_tag = creator_data.content_tag;
        const platform = history[i]['platform'];
        const last_watch = history[i]['last_watch'];

        const div = 
        `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
        <div class="col-md-4">
            <img src="imgs/${pic}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
            <h5 class="card-title"> ${creator_id}</h5>
            <p class="card-text">${platform} ${content_tag}</p>
            <p class="card-text"><small class="text-muted">Watched ${last_watch}</small></p>
            </div>
        </div>
        </div>
    </div>`;
        }
       document.getElementById('history-cards').insertAdjacentHTML( 'beforeend', div);

}

async function clearHistory() {
    const url = '/clearwatchhist/'
    const user_id = window.localStorage.getItem('username');
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ id: user_id})
    });
    // reload the page
    window.location.reload();
}

const createBtn = document.getElementById('clear-history');

createBtn.addEventListener('click', clearHistory);
