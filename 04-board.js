var express = require('express');
var w3 = require('web3');
var ipfsApi = require('ipfs-api');
var async = require('async');

var ipfs = ipfsApi();
var app = express();

// UPDATE the three values below!
var sandboxId = 'c0785d9d6d';
var sandboxUrl = 'https://trainer03.by.ether.camp:8555/sandbox/' + sandboxId;
var contractAddress = '0x8c65ae6ccd6c72d623ea847636f78ddc77685087';
// \UPDATE

var web3 = new w3(new w3.providers.HttpProvider(sandboxUrl));

require ('./abi.js');

web3.eth.defaultAccount = web3.eth.accounts[0];
var contractObject = web3.eth.contract(contractAbi);
var contractInstance = contractObject.at(contractAddress);
console.log(JSON.stringify(contractAbi));

var event = contractInstance.receivedMessage((error, result) => {
    if (error)
        throw error;
    console.log('new message: ' + JSON.stringify(result["args"]));
})

app.get('/addMessage', (req, res) => {
    var message = req.query.message;
    ipfs.add(new Buffer(message), (e, r) => {
        if (e)
            throw e;
        var hash = r[0].hash;
        contractInstance.addMessage(hash, (error, response) => {
            if (error)
                throw error;
            res.send('message: ' + message + '<br />hash: ' + hash + '<br />added successfully!');
        })
    })
});

app.get('/getMessages', (req, res) => {
    var messages = [];
    contractInstance.getNumMessages((error, numMessages) => {
        if (error)
            throw error;
        async.times(numMessages, (n, next) => contractInstance.getMessage(n, (e1, messageObject) => {
            if (e1)
                throw e1;
            console.log('message object: ' + JSON.stringify(messageObject));
            ipfs.cat(messageObject[1], (e2, r) => {
                if (e2)
                    throw e2;
                r.on('data', (chunk) => {
                    if (!messageObject[4]) {
                        messages.push({ 'senderAddress':    messageObject[0],
                                        'text':             chunk.toString(),
                                        'time':             messageObject[2],
                                        'value':            messageObject[3]
                        })
                    }
                })
            });
            next(e1, messageObject);
        }), (eTotal, valTotal) => {
            if (eTotal)
                throw eTotal;
            res.send('messages: ' + JSON.stringify(messages));
        });
    })
});

app.get('/test', (req, res) => {
    res.send('test working!');
})

var port = 8080;
app.listen(port, (error, response) => {
    console.log('express webserver running on port ' + port);
});
