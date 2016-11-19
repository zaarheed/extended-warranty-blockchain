var express = require('express');
var w3 = require('web3');
var app = express();

// UPDATE the three values below!
var sandboxId = '34b4231bbc';
var sandboxUrl = 'https://zahidepam.by.ether.camp:8555/sandbox/' + sandboxId;
var contractAddress = '0x8c65ae6ccd6c72d623ea847636f78ddc77685087';
// \UPDATE

var web3 = new w3(new w3.providers.HttpProvider(sandboxUrl));

require ('./abi-warranty.js');

web3.eth.defaultAccount = web3.eth.accounts[0];
var contractObject = web3.eth.contract(contractAbi);
var contractInstance = contractObject.at(contractAddress);
console.log(JSON.stringify(contractAbi));

app.get('/test', (req, res) => {
res.send('all ok!');
});

app.get('/policySale', (req, res) => {
    var customerAddress = req.query.address;
    var serial = req.query.serial;
    var incept = req.query.incept;
    var expiry = req.query.expiry;
    var price = req.query.price;
    var retailer = req.query.retailer;
    
    contractInstance.policySale(customerAddress, serial, incept, expiry, price, retailer, function(error, response) {
            if (error)
                throw error;
            console.log('new product added. Customer: ' + customerAddress + '   Serial No: ' + serial + '   Insurance Ends: ' + expiry);
            res.send('new product added. Customer: ' + customerAddress + '   Serial No: ' + serial + '   Insurance Ends: ' + expiry);
    });
});

app.get('/getPolicy', (req, res) => {
    var customerAddress = req.query.customerAddress;
    var serial = req.query.serial;
    
    contractInstance.getPolicy((customerAddress, serial) => {
        if (error)
            throw error;
        res.send('This page needs work...' + response);
    });
});

app.get('/newClaim', (req, res) => {
    var customerAddress = req.query.customerAddress;
    var serial = req.query.serial;
    var date = req.query.date;
    var repairAddress = req.query.repairAddress;
    var retailerAddress = req.query.retailerAddress;
    
    contractInstance.newClaim(customerAddress, serial, date, repairAddress, retailerAddress, function(error, response) {
            if (error)
                throw error;
            console.log('New claim created. Customer: ' + customerAddress + '   Serial No: ' + serial + '   Date: ' + date);
            res.send('New claim created. Customer: ' + customerAddress + '   Serial No: ' + serial + '   Date: ' + date);
    });
});

app.get('/getClaim', (req, res) => {
    var policyID = req.query.policy;
    
    contractInstance.getClaimDetails((policyID) => {
        // if (error)
        //     throw error;
        res.send('This page needs work...' + response);
    });
});


app.use('/', express.static('public'));

var port = 8080;
app.listen(port, (error, response) => {
    console.log('express webserver running on port ' + port);
})
