function getCurrentDateTime() {
    const date = new Date();
    return date.toString();
}
export async function watch(creator_id) {
    console.log("watching " + creator_id);
    const url = '/updatewatchhist'
    const dateTime = getCurrentDateTime();
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            creator_id: creator_id, id: window.localStorage.getItem('username'),
            last_watch_time: dateTime
        })
    });
    console.log(response);
}