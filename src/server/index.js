const express = require('express')
const app = express();
const PORT = 8080;

app.use(express.json());

app.listen(
    PORT,
    () => console.log('server up!')
)
// TESTING API
app.get('/test', (req, res) => {
    res.status(200).send({
        test: 'hi',
        next: 'other'
    });
});

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