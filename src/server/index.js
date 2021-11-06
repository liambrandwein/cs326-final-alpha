const express = require('express')
const app = express();
const PORT = 8080;

app.use(express.json());

app.use(express.static('src'));

app.listen(
    PORT,
    () => console.log('server up!')
);
// TESTING API
// app.get('/test', (req, res) => {
//     res.status(200).send({
//         test: 'hi',
//         next: 'other'
//     });
// });

// STATIC HTML:
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: 'src'});
});

app.get('/history', (req, res) => {
    res.sendFile('history.html', {root: 'src'});
});

app.get('/subscription', (req, res) => {
    res.sendFile('manager.html', {root: 'src'});
});

app.get('/signin', (req, res) => {
    res.sendFile('signin.html', {root: 'src'});
});

app.get('/signup', (req, res) => {
    res.sendFile('signup.html', {root: 'src'});
});

app.get('/results', (req, res) => {
    res.sendFile('searchResult.html', {root: 'src'});
})

app.post('/createaccount', (req, res) => {   
    // {id: 'email@aol.com', password: 'asdfj42fg'} 
    const body = req.body;
    
    if (!body.id || !body.pass) {
        res.status(400).send({
            result: 'Error: need email and password'
        });
    }

    res.status(200).send({
        result: `Account creation successful! Email is ${body.id} and pass is ${body.pass}`
    });
});

app.post('/addcreator', (req, res) => {
    // {hikaru: [{platform: youtube, url: 'youtube.com/ksdajflkjsa.com'}, {platform...}...]}
    const body = req.body;
    // Add function to add this to subscribed things
    const name = Object.keys(body)[0];

    /*
    if req.params.hasOwnProperty('watch-history') <--- add to watch-history
    else if req.params.hasOwnProperty('sub-manager') <--- add to subscribed creators
    */

    if (!body[name]) {
        res.status(400).send({
            result: 'Error: need creator name and platforms'
        });
    }

    res.status(200).send({
        result: `Creator added. Name is ${name} and platforms are ${body[name]}`
    });
});

app.delete('/removecreator', (req, res) => {
    /*
    use req.params to find the person to delete, should have name as param to lookup from table
    */
   res.status(200).send({
        result: 'Deleted.'
   });
});