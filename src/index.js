//function for dynamically loading creator content
if (!window.localStorage.getItem('username')) {
  window.location.href = './signin';
}

async function loadRecommendedContent() {
  const username = window.localStorage.getItem('username');

  let url = '/getusersubdata/' + username;

  const subResponse = await fetch(url);
  const subDataJSON = await subResponse.json();
  const subData = subDataJSON.subs;
  url = '/getallcreatordata';

  const cResponse = await fetch(url);
  const cData = await cResponse.json();
  console.log(cData);

  // for (let i = 1; i <= 3; i++) {
  //   if (i > subData.length) { break; }
  //   document.getElementById('t-str-' + i).innerText = subData[i - 1];
  //   document.getElementById('t-text-' + i).innerText = cData[subData[i - 1]].content_tag.join(" ");
  //   document.getElementById('t-link-' + i).href = cData[subData[i - 1]].data[1].url;

  //   document.getElementById('yt-str-' + i).innerText = subData[i - 1];
  //   document.getElementById('yt-text-' + i).innerText = cData[subData[i - 1]].content_tag.join(" ");
  //   document.getElementById('yt-link-' + i).href = cData[subData[i - 1]].data[0].url;
  // }
}

loadRecommendedContent();
