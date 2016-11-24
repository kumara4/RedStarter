var firebase = require("firebase");
var gcloud = require('google-cloud');
var express = require('express');
var multer = require("multer");
var uploader = multer({storage: multer.memoryStorage({})});
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var graph = require('fbgraph');

//RESOURCES
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// FB.init({
//     appId: '1799926606953024',
//     status: true,
//     xfbml: true,
//     version: 'v2.7' // or v2.6, v2.5, v2.4, v2.3
// });
/**
 * Google cloud storage part
 */
var CLOUD_BUCKET = "redstarter-b0908.appspot.com"; //From storage console, list of buckets
var gcs = gcloud.storage({
    projectId: 'redstarter-b0908', //from storage console, then click settings, then "x-goog-project-id"
    keyFilename: 'RedStarter-329502b8049c.json' //the key we already set up
});
function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}
var bucket = gcs.bucket(CLOUD_BUCKET);


//FIREBASE SETUP
firebase.initializeApp({
    serviceAccount: "RedStarter-329502b8049c.json",
    databaseURL: "https://redstarter-b0908.firebaseio.com",

});
var fireRef = firebase.database().ref('newUsers');


//SET PORT
var port = process.env.PORT || 3000;


//GLOBAL VARIABLES
var currentuser = "";
var correct = false;
var responce = "";


//UPLOAD IMAGE ON GOOGLEDOC
//From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
function sendUploadToGCS(req, res, next) {
    if (!req.file) {
        return next();
    }

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
        file.acl.add(options, function (a, e) {
            next();
        });//Make file world-readable; this is async so need to wait to return OK until its done
    });

    stream.end(req.file.buffer);
}


//SET COOKIES TO TRACK USER
app.get('/cookie', function (req, res) {
    var data = {
        user: req.cookies.currentuser
    };
    // No user is signed in.
    res.send(data);
});

app.get('/fbcookie', function (req, res) {

    // if(req.cookies.terms == undefined){
        console.log("First cookie ");

    //     ar.push(req.body.help);
         res.cookie("terms", JSON.stringify(req.query.hi)).send('Added term!');

});

app.get('/fbuidcookie', function (req, res) {

    // if(req.cookies.terms == undefined){
    console.log("fb uid ");

    //     ar.push(req.body.help);
    res.cookie("fbuid", JSON.stringify(req.query.fbuid)).send('Added term!');

});

app.get('/getfbcookie', function (req, res) {

    //console.log(req);
    // if(req.query.likes == "true"){
    //     console.log("I want to access fb pi from backend");
    //
    //     firebase.auth().verifyIdToken(req.query.token).then(function (decodedToken) {
    //         var uid = decodedToken.uid;
    //         console.log("THE GETFB UID IS " + uid);
    //         console.log(decodedToken);
    //
    //
    //     });
    //     //graph.setAccessToken(access_token);
    //
    //     // var fb = FB.api(result.user.providerData[0].uid + '/likes', {
    //     //     fields: 'user_likes',
    //     //     access_token: token
    //     // }, function (response) {
    //     //     getpages(response.data, token);
    //     //     var names=[];
    //     //     function storenames(name){
    //     //         names.push(name);
    //     //     }
    //     //     console.log(response.data);
    //     // });
    // }


    console.log("getting terms from cookie");

    if(req.cookies.terms){
        console.log("sending temrs");
        res.send(req.cookies.terms);
    }
});


//SET COOKIES TO TRACK USER
app.post('/savefbuser', function (req, res) {
    var idToken = req.body.token;
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var uid = decodedToken.uid;
        var user = decodedToken.email.split("@")[0];

        var userRef = firebase.database().ref('newUsers/' + user+"/fbCred");
        userRef.child("uid").set({"uid": uid}, function () {
            res.send("OK!");
        }).catch(function () {
            res.status(403);
            res.send();
        });
    });
});


//Delete a user's subreddit
app.delete('/removeSub', function (req, res) {
    console.log("Client wants to delete the users subreddit: '" + req.body.sub);
    var idToken = req.body.token;
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var user = decodedToken.email.split("@")[0];
        var subRef = firebase.database().ref('newUsers/' + user + "/subreddits");
        subRef.child(req.body.subid).remove().catch(function () {
            res.status(403);
        });
        res.send("OK!");
    });

});

//Add a subreddit to user's entry if they select it
app.post('/addSub', function (req, res) {

    var postData = {
        subreddit: req.body.sub,
        subid: req.body.subid
    };

    var idToken = req.body.token;


    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var user = decodedToken.email.split("@")[0];

        var subRef = firebase.database().ref('newUsers/' + user + "/subreddits");
        subRef.child(req.body.subid).set({"display_name": req.body.sub});
        res.send("OK");
    });



});


//Check to see if user has an account, if not do not allow login access
app.get('/login', function (req, res) {
    currentuser = req.query.user.toString();
    fireRef.child(currentuser).once('value', function (snapshot) {
        correct = (snapshot.val() !== null && snapshot.val().info.password == req.query.pass && req.query.user == snapshot.val().info.username);
        if (correct) {
            currentuser = req.query.user;
            res.cookie("currentuser", req.query.user.toString()).send({url: "landing.html", user: currentuser});
        } else {
            responce = {
                url: "",
                user: currentuser,
                display: "inline",
                uerror: ["has-error", "inputError1", "Username/Password Incorrect"]
            };
            res.send(responce);
        }

    });
});

// //Check to see if user has an account, if not do not allow login access
// app.get('/loginFB',  function (req, res) {
//     console.log(req);
//     res.send("ok");
//     // var userRef = firebase.database().ref('newUsers/' + authData.uid);
//     // userRef.on('value',(snapshot) => {
//     //     var data = snapshot.val() || {};
//     //     if(!data.uid){
//     //         userRef.set({
//     //             uid: authData.uid,
//     //             email: authData.email,
//     //             photo: authData.photoURL
//     //         });
//     //     }
//     //
//     // });
// });


//Store new user info in firebase
app.post('/signup', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    var ffirstname = req.body.firstname;
     var flastname = req.body.lastname;
    var femail = req.body.email;
    var fusername = req.body.username;
    var fpassword = req.body.password;
    var fcpassword= req.body.cpassword;
    var fcemail = req.body.cemail;


    var newUser = {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
    };
    var userexists = false;

    if (fusername == "" || fpassword == "" || fcpassword == "" || femail == "" || fcemail == "" || ffirstname == "" || flastname == "") {
        res.send({
            error: "blank"
        })

    }


        fireRef.child(fusername).once('value', function (snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                userexists = true;
            }
            if (userexists) {
                console.log("user exists");
                res.send({
                    error: "exists"
                })
            }
            else if (femail != fcemail) {
                console.log("email not same");
                res.send({error: "confirmemail"
                })
            }
            else if (fpassword != fcpassword) {
                console.log("pass not same");
                res.send({
                    error: "confirmpass"
                })
            } else {

                console.log("Client wants to signup a newuser with username" + req.body.username);
                fireRef.child(req.body.username.toString()).set({"info": newUser}, function () {
                    console.log("COOKIE CREATED in signup");


                });
                if (req.file) {
                    var subRef = firebase.database().ref('newUsers/' + req.body.username.toString());
                    subRef.child("img").set({"img": getPublicUrl(req.file.cloudStorageObject)});
                }
                res.cookie("currentuser", req.body.username.toString()).send({error: "",redirectUrl: "/landing.html"});




            }


        });














});


//Helper to get the a current useer (Not used)
app.get('/user', function (req, res) {
    console.log("Getting current user in the backend");
    res.send({user: currentuser});

});

//Helper to get img from cloud
app.get('/img', function (req, res) {
    console.log("Getting current user in the backend");
    var subRef = firebase.database().ref('newUsers/' + req.query.user.toString() + "/img");
    var theimg = subRef.child("img").once('value', function (snapshot) {
        if (snapshot.val()) {
            console.log("snapcshot is " + snapshot.val());
            res.send({img: snapshot.val()});
        } else {
            res.send({img: "no"});
        }

    });


});




app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
/**
 * Created by Henry on 10/24/2016.
 */
