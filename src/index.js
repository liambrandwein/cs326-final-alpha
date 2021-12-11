
import { watch } from './utils.js';
// Check if logged in

// if (!window.localStorage.getItem('username')) {
//   window.location.href = './signin';
// }

async function loadDefaultRecommendedContent(platform) {
  //const defaultCategories = ['chess', 'cooking', 'coding', 'politics'];
  const defaultCategories = ['chess', 'cooking'];
  const RESULTS_LIMIT_PER_CATEGORY = 8;
  let items = [];
  console.log("loadDefaultRecommendedContent" + platform);
  for (const category of defaultCategories) {
    let url = '';
    if (platform == 'youtube') {
      url += '/getYoutubeSearchResults/';
    }
    else {
      url = '/getTwitchSearchResults/';
    }
    url += category;
    const response = await fetch(url);
    let data = await response.json();
    data = data.slice(0, RESULTS_LIMIT_PER_CATEGORY);
    items = items.concat(data);
  }
  console.log("loadDefaultRecommendedContent");
  console.log(items);
  return items;
}

// each item is {channel_name, profile_pic, platform, channel_id, url}
function populateRecommendedContent(items) {
  for (let i = 0; i < items.length; i++) {
    // only the first card in the caurosel should be "active"
    const channel_name = items[i].channel_name;
    const profile_pic = items[i].profile_pic;
    const url = items[i].url;
    const platform = items[i].platform;
    const channel_id = items[i].channel_id;
    const active = document.getElementById(`recommend-${platform}`).childElementCount == 0 ? "active" : "";
    const div =
      `
      <div class="carousel-item col-12 col-sm-6 col-md-4 col-lg-3 ${active}">
      <div class="card" style="width: 250px;margin: auto;">
        <img src="${profile_pic}" class="card-img-top">
        <div class="card-body">
          <h4 class="card-title">${channel_name}<h4>
          <a id="home-watch-${channel_name}" href="${url}" class="btn btn-primary">Watch now</a>
        </div>
      </div>
    </div>
        `;

    document.getElementById(`recommend-${platform}`).insertAdjacentHTML('beforeend', div);
    document.getElementById(`home-watch-${channel_name}`).addEventListener('click', () => watch(channel_name));

  }
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
  let items = [];
  for (let i = 0; i < subs.length; i++) {
    const creator_id = subs[i];
    // query creator's data
    const creator_url = '/getcreatordata/' + creator_id;
    const creator_response = await fetch(creator_url);
    const creator_data = await creator_response.json();
    const pic = creator_data.thumbnail;
    const platform = creator_data['data'][0].platform;
    const platform_url = creator_data['data'][0].url;
    items.push({
      channel_name: creator_id,
      profile_pic: pic,
      url: platform_url,
      platform: platform,
      channel_id: creator_id
    });
    if (platform === 'youtube') {
      youtube_num += 1;
    }
    if (platform === 'twitch') {
      twitch_num += 1;
    }
  }

  // if (youtube_num < 8) {
  //   let defaultYoutube = await loadDefaultRecommendedContent('youtube');
  //   items = items.concat(defaultYoutube);
  // }
  // if (twitch_num < 8) {
  //   let defaultTwitch = await loadDefaultRecommendedContent('twitch');
  //   items = items.concat(defaultTwitch);
  // }

  console.log("items");
  console.log(items);
  // remove duplicated channel_names from items
  items = items.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.channel_name === item.channel_name
    ))
  );
  populateRecommendedContent(items);


}

loadRecommendedContent();
