import { watch } from './utils.js';

// Check if logged in

// if (!window.localStorage.getItem('username')) {
//   window.location.href = './signin';
// }

async function loadDefaultRecommendedContent() {
  const defaultCategories = ['chess', 'cooking'];
}
//function for dynamically loading creator content
async function loadRecommendedContent() {
  const check = await fetch('/auth');
  const checkResponse = await check.json();
  if (checkResponse.hasOwnProperty('Error')) {
    window.location.href = './signin';
  }
  // formerly used window local storage
  const username = 'placeholder'
  const url = '/getusersubdata/' + username;
  const response = await fetch(url);
  const data = await response.json();
  const subs = data.subs;
  console.log(subs);


  let youtube_num = 0;
  let twitch_num = 0;
  for (let i = 0; i < subs.length; i++) {
    const creator_id = subs[i];
    console.log("sub creator_id" + creator_id);
    // query creator's data
    const creator_url = '/getcreatordata/' + creator_id;
    console.log(creator_url);
    const creator_response = await fetch(creator_url);
    const creator_data = await creator_response.json();
    console.log(creator_data);
    console.log(creator_data.data);
    const pic = creator_data.thumbnail;
    //const content_tag = creator_data.content_tag;
    const platform = creator_data['data'][0].platform;
    const platform_url = creator_data['data'][0].url;
    // only the first card in the caurosel should be "active"
    let active = "";
    if (platform == "youtube" && youtube_num == 0) {
      active = "active";
    }
    if (platform == "twitch" && twitch_num == 0) {
      active = "active";
    }

    if (platform === 'youtube') {
      youtube_num += 1;
    }
    if (platform === 'twitch') {
      twitch_num += 1;
    }
    const div =
      `
      <div class="carousel-item col-12 col-sm-6 col-md-4 col-lg-3 ${active}">
      <div class="card" style="width: 250px;margin: auto;">
        <img src="${pic}" class="card-img-top">
        <div class="card-body">
          <h4 class="card-title">${creator_id}<h4>
          <button type="button" class="btn btn-warning" href="${platform_url}" id="home-watch-${creator_id}">Watch Now!</button>
        </div>
      </div>
    </div>
       
        `;

    document.getElementById(`recommend-${platform}`).insertAdjacentHTML('beforeend', div);
    console.log("watch " + creator_id);
    document.getElementById(`home-watch-${creator_id}`).addEventListener('click', () => watch(creator_id));

  }

  if (youtube_num < 8) {

  }
  if (twitch_num < 8) {

  }


}

loadRecommendedContent();
