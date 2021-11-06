const express = require('express');
const handle = require('./handle_reqs');
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

app.post('/createaccount', handle.createAccount);

app.post('/addusersub', handle.addUserSub);

app.delete('/removeusersub', handle.removeUserSub);

app.patch('/updatewatchhist', handle.updateWatchHist);