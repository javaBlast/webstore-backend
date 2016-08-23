var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var app = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var jwt = require('jsonwebtoken');

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

app.set('superSecret', 'ilovescotchyscotch'); // secret variable

// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

mongoose.connect('mongodb://blast:benzocar@ds051863.mlab.com:51863/wevstore')

var productSchema = new Schema({
    title: String,
    image: String,
    text: String
});

var commentScheme = new Schema({
    prod: String,
    name: String,
    text: String,
});

var userScheme = new Schema({
    name: String,
    password: String
});

var Product = mongoose.model('Product', productSchema);
var Comment = mongoose.model('Comment', commentScheme);
var User = mongoose.model('User', userScheme);

app.get('/products', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    Product.find({}).exec(function (err, prod) {
        res.json(prod);
    })
});



app.get('/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var productId = req.params.id;
    console.log(productId)

    Product.findById({ _id: req.params.id }).exec(function (err, prod) {

        Comment.find({ prod: productId }).exec(function (err, comm) {
            var result = {
                prod,
                comm
            }
            res.json(result);
        });
    });
});

app.post('/comments/new/', urlencodedParser, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var comm = new Comment({
        prod: req.body.prod,
        name: req.body.username,
        text: req.body.text
    });
    comm.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('new comment create');
            res.send("created " + req.body.username + " " + req.body.text);
        }
    });
});

app.post('/registration/new', urlencodedParser, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var newUser = new User({
        name: req.body.name,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("new user create")
            res.redirect('http://localhost:8000/');
        }
    })
});

app.post('/authenticate',urlencodedParser, function (req, res) {

        console.log(req.body)
    // find the user
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});