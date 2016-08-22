var express = require('express');
var mongoose = require('mongoose');

var app = express();


mongoose.connect('mongodb://blast:benzocar@ds051863.mlab.com:51863/wevstore')


var Product = mongoose.model('Product', {
    title: String,
    image: String,
    text: String,
})

var Recall = mongoose.model('Recall', {
    rate: Number,
    text: String,
})

var User = mongoose.model('User', {
    username: String,
    password: String
})



app.get('/products', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    Product.find({}).exec(function (err, prod) {
        res.json(prod);
    })
});


app.get('/products/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    Product.findById({ _id: req.params.id }).exec(function (err, prod) {
        res.json(prod);
    })
});


app.get('/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    Product.findById({ _id: req.params.id }).exec(function (err, prod) {
        res.json(prod);
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});