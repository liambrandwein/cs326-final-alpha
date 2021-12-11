
import { watch } from './utils.js';
async function unsubscribe(creator_id) {

  const url = '/removeusersub';

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ creator_id: creator_id, user_id: 'placeholder' })
  });

  window.location.reload();
}


async function loadSubs() {
  const check = await fetch('/auth');
  const checkResponse = await check.json();
  if (checkResponse.hasOwnProperty('Error')) {
    window.location.href = './signin';
  }
  // const email = window.localStorage.getItem('username');
  const url = '/getusersubdata/' + 'id';
  const response = await fetch(url);
  const data = await response.json();
  const subs = data.subs;


  // display the subs
  for (let i = 0; i < subs.length; i++) {
    const creator_id = subs[i];

    // query creator's data
    const creator_url = '/getcreatordata/' + creator_id;

    const creator_response = await fetch(creator_url);
    const creator_data = await creator_response.json();


    const pic = creator_data.thumbnail;
    //const content_tag = creator_data.content_tag;
    const platform = creator_data['data'][0].platform;
    const platform_url = creator_data['data'][0].url;
    const div =
      `
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${pic}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${creator_id}</h5>
                <p class="card-text">${platform}</p>
                <a id="sub-watch-${creator_id}" href="${platform_url}" class="btn btn-primary">Watch now</a>
                <a id="unsub-${creator_id}" class="btn btn-danger">unsubscribe</a>
              </div>
            </div>
          </div>
        </div>
        `;
    document.getElementById('manager-cards').insertAdjacentHTML('beforeend', div);



    document.getElementById(`sub-watch-${creator_id}`).addEventListener('click', () => watch(creator_id));
    document.getElementById(`unsub-${creator_id}`).addEventListener('click', () => unsubscribe(creator_id));
  }
}

loadSubs();
