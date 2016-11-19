var express = require('express');
var w3 = require('web3');
var app = express();

// UPDATE the three values below!
var sandboxId = '34b4231bbc';
var sandboxUrl = 'https://zahidepam.by.ether.camp:8555/sandbox/' + sandboxId;
var contractAddress = '0xb67e32eb52b8f4306b52278c3cd11f903dfae594';
// \UPDATE

var web3 = new w3(new w3.providers.HttpProvider(sandboxUrl));

require ('./abi.js');

web3.eth.defaultAccount = web3.eth.accounts[0];
var contractObject = web3.eth.contract(contractAbi);
var contractInstance = contractObject.at(contractAddress);
console.log(JSON.stringify(contractAbi));

app.get('/test', (req, res) => {
res.send('all ok!');
});

app.get('/setGreeting', (req, res) => {
    var greeting = req.query.greeting;
    contractInstance.setGreeting(greeting, function(error, response) {
        if (error)
            throw error;
        console.log('set greeting to ' + greeting);
        contractInstance.getGreeting(function(error2, response2) {
            if (error2)
                throw error2;
            res.send('set greeting and read it back: ' + response2);
        });
    });
});

app.get('/getGreeting', (req, res) => {
    contractInstance.getGreeting((error, response) => {
        if (error)
            throw error;
        res.send('greeting: ' + response);
    });
})

app.use('/', express.static('public'));

var port = 8080;
app.listen(port, (error, response) => {
    console.log('express webserver running on port ' + port);
})
