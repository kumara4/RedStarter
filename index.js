<<<<<<< HEAD
var express = require('express');
var gcloud = require('google-cloud');
var firebase = require('firebase');
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage({}) });
var app = express();
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
=======
var firebase = require("firebase");
var gcloud = require('google-cloud');
var express = require('express');
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage({}) });
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');

//RESOURCES
>>>>>>> gh-pages
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

<<<<<<< HEAD
firebase.initializeApp({
    serviceAccount: "RedStarter-329502b8049c.json",
    databaseURL: "https://redstarter-b0908.firebaseio.com/"
});
var fireRef = firebase.database().ref('newUsers');
=======
>>>>>>> gh-pages

/**
 * Google cloud storage part
 */
var CLOUD_BUCKET="redstarter-b0908.appspot.com"; //From storage console, list of buckets
var gcs = gcloud.storage({
    projectId: 'redstarter-b0908', //from storage console, then click settings, then "x-goog-project-id"
    keyFilename: 'RedStarter-329502b8049c.json' //the key we already set up
});
<<<<<<< HEAD
// From blob store example
function getPublicUrl (filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}

var bucket = gcs.bucket(CLOUD_BUCKET);

=======
function getPublicUrl (filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}
var bucket = gcs.bucket(CLOUD_BUCKET);


//FIREBASE SETUP
firebase.initializeApp({
    serviceAccount: "RedStarter-329502b8049c.json",
    databaseURL: "https://redstarter-b0908.firebaseio.com/"
});
var fireRef = firebase.database().ref('newUsers');


//SET PORT
var port = process.env.PORT || 3000;


//GLOBAL VARIABLES
var currentuser = "";
var correct = false;
var responce = "";




//UPLOAD IMAGE ON GOOGLEDOC
>>>>>>> gh-pages
//From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
function sendUploadToGCS (req, res, next) {
    if (!req.file) {
        return next();
    }
<<<<<<< HEAD
    // console.log("send upload to GCS");
=======
>>>>>>> gh-pages

    var gcsname = Date.now() + req.file.originalname;
    var file = bucket.file(gcsname);


    var stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', function (err) {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', function () {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        var options = {
            entity: 'allUsers',
            role: gcs.acl.READER_ROLE
        };
        file.acl.add(options, function(a,e){next();});//Make file world-readable; this is async so need to wait to return OK until its done
    });

    stream.end(req.file.buffer);
}

<<<<<<< HEAD
//upload image
app.post('/todo', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    // console.log("upload image1");
    var data = {"text" : req.body.todoText};
    if(req.file)
        data.img = getPublicUrl(req.file.cloudStorageObject);
    fireRef.push(data, function () {
        // console.log("upload image");
        res.send("OK!");
    }).catch(function(){
        console.log("upload image - catch");
        res.status(403);
        res.send();
    });
});


var currentuser = "";
var correct = false;
var responce = "";


app.get('/cookie', function (req, res) {
    res.send({user:req.cookies.currentuser});
});



app.get('/login', function (req, res) {
    console.log("New req loging");
    console.log("Client wants to login as: '" + req.query.user + "'");

    currentuser = req.query.user.toString();
    fireRef.child(currentuser).once('value', function (snapshot) {

        correct = (snapshot.val() !== null && snapshot.val().info.password == req.query.pass && req.query.user == snapshot.val().info.username);

        if (correct) {
            currentuser= req.query.user;

            responce = {url:"landing.html", user: currentuser};

        } else {
            responce = {url: "", user: currentuser, display: "inline", uerror: ["has-error", "inputError1", "Username/Password Incorrect"]};
        }

        console.log("Sendinng responce of " + correct);
        if(req.cookies.helloSent == "true")
            console.log("I already said hello to you!");
        else{
            console.log("COOKIE CREATED");
            res.cookie("currentuser", req.query.user.toString());
        }


        res.send(responce);
    });
});

//Make a new one
app.post('/signup', function (req, res) {
    console.log("New req");
    console.log("Client wants to create todo: '" + req.body.user + "'");
    currentuser = req.body.user.toString();
    fireRef.child(req.body.user.toString()).set({"info": req.body.newuser}, function () {
        res.send({redirectUrl: "/landing.html"});

    }).catch(function () {
        res.status(403);
        res.send();
    });


});


=======

//SET COOKIES TO TRACK USER
app.get('/cookie', function (req, res) {
    res.send({user:req.cookies.currentuser});
});



//Add a subreddit to user's entry if they select it
app.post('/addSub', function(req,res){

    var postData=  {
        subreddit: req.body.sub,
        subid: req.body.subid
    };

   var subRef = firebase.database().ref('newUsers/'+req.body.user.toString()+"/subreddits");
    subRef.child(req.body.subid).set({"display_name":req.body.sub});
    res.send("OK");
});



//Check to see if user has an account, if not do not allow login access
app.get('/login',  function (req, res) {
    currentuser = req.query.user.toString();
    fireRef.child(currentuser).once('value', function (snapshot) {
        correct = (snapshot.val() !== null && snapshot.val().info.password == req.query.pass && req.query.user == snapshot.val().info.username);
        if (correct) {
            currentuser= req.query.user;
            res.cookie("currentuser", req.query.user.toString()).send({url:"landing.html", user: currentuser});
        } else {
            responce = {url: "", user: currentuser, display: "inline", uerror: ["has-error", "inputError1", "Username/Password Incorrect"]};
            res.send(responce);
        }

    });
});


//Store new user info in firebase
app.post('/signup', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    var newUser = {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
    };
    console.log("Client wants to signup a newuser with username" + req.body.username);
    fireRef.child(req.body.username.toString()).set({"info": newUser}, function () {
        console.log("COOKIE CREATED in signup");


    });
    var subRef = firebase.database().ref('newUsers/'+req.body.username.toString());
    subRef.child("img").set({"img":getPublicUrl(req.file.cloudStorageObject)});
    res.cookie("currentuser", req.body.username.toString()).send({redirectUrl: "/landing.html"});
});


//Helper to get the a current useer (Not used)
>>>>>>> gh-pages
app.get('/user', function (req, res) {
    console.log("Getting current user in the backend");
    res.send({user: currentuser});

});

<<<<<<< HEAD
//Edit one
// app.put('/todo', function (req, res) {
//     console.log("Client wants to update todo: '" +req.body.key+ " To " + req.body.todoText + "'");
//     if(req.body.todoText.toLowerCase().includes("lasagna"))
//     {
//         res.status(403);
//         res.send();
//     }
//     else
//         fireRef.child(req.body.key).set({"text": req.body.todoText}, function () {
//             res.send("OK!");
//         }).catch(function(){
//             res.status(403);
//             res.send();
//         });
// });
//Delete one
// app.delete('/todo', function (req, res) {
//     console.log("Client wants to delete todo: '" +req.body.key);
//     fireRef.child(req.body.key).once("value", function(item){
//         if(item.val().text.toLowerCase().includes("lasagna"))
//             res.status(403);
//         else
//         {
//             fireRef.child(req.body.key).remove();
//             res.send("OK!");
//         }
//     }).catch(function(){
//         res.status(403);
//     });
// });
=======
//Helper to get img from cloud
app.get('/img', function (req, res) {
    console.log("Getting current user in the backend");
    var subRef = firebase.database().ref('newUsers/'+req.query.user.toString()+"/img");
    var theimg = subRef.child("img").once('value', function (snapshot) {
        if(snapshot.val()){
            console.log("snapcshot is " + snapshot.val());
            res.send({img: snapshot.val()});
        }else{
            res.send({img: "no"});
        }

    });


});



//Delete a user's subreddit
app.delete('/removeSub', function (req, res) {
    console.log("Client wants to delete the users subreddit: '" +req.body.sub);
    var subRef = firebase.database().ref('newUsers/'+req.body.user.toString()+"/subreddits");
    subRef.child(req.body.subid).remove().catch(function(){
        res.status(403);
        });
    res.send("OK!");

});
>>>>>>> gh-pages



app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
/**
 * Created by Henry on 10/24/2016.
 */
