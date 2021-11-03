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