export async function watch(creator_id) {
    const url = '/updatewatchhist'
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ creator_id: creator_id, id: window.localStorage.getItem('username') })
    });
    console.log(response);
}