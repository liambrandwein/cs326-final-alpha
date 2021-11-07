async function loadSubs() {
    const email = window.localStorage.getItem('username');
    const url = '/getusersubdata/' + email;
    const response = await fetch(url);
    const data = await response.json();
    const subs = data.subs;
    console.log(subs);

    // display the subs
    for (let i = 0; i < subs.length; i++) {
        const creator_id = subs[i];
         // query creator's data
         const creator_url = '/getcreatordata/' + creator_id;
         const creator_response = await fetch(creator_url);
         const creator_data = await creator_response.json();
        console.log(creator_data);
         const pic = creator_data.profile_pic;
         const content_tag = creator_data.content_tag;
        const div = 
        `
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="imgs/${pic}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${creator_id}</h5>
                <p class="card-text">${content_tag}</p>
                <a href="#" class="btn btn-danger">unsubscribe</a>
              </div>
            </div>
          </div>
        </div>
        `;
        document.getElementById('manager-cards').insertAdjacentHTML( 'beforeend', div);
    }
}

loadSubs();