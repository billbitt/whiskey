const express = require('express');
const async = require('async');
const bodyParser = require('body-parser');
const randomId = require('./utils/randomId.js');
const createHash = require('./utils/createHash.js');

// import the data
const clauseLib = require('./data/clause.json');

// get the port
const PORT = parseInt(process.argv[2]) || 3000;

//instantiate the node
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Generate an id for this node
const nodeIdentifier = randomId('xWHISKEYx', 40);

require('./utils/checkCryptoSupport.js');

// routes

// get a clause from lib
// returns clause (object)
app.get('/clause/:hash', (req, res) => {
    const hash = req.params.hash;
    const clause = clauseLib[hash];
    if (clause) {
        res.status(200).json(clause);
    } else {
        res.status(404).send();
    }
});

app.get('/clause', (req, res) => {
    res.status(200).json(clauseLib);
});

// add new clause to lib
// return hash (object)
app.post('/clause', (req, res) => {
    if (!req.body) {
        return res.status(500).send();
    }
    const clause = {
        title: req.body.title,
        content: req.body.content,
    };
    // add clause to library
    const hash = createHash(clause);
    clauseLib[hash] = clause;
    // send response
    res.status(200).json({hash});
});

// node information
app.get('/node', (req, res) => {
    res.status(200).json({
        node: nodeIdentifier,
        clauseLib,
    })
});

// default route
app.get('/', (req, res) => {
    // send react app
});

// start the server
app.listen(PORT, () => {
    console.log(`\nWhiskey now being served on port ${PORT}!`)
});
