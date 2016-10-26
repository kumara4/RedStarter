var firebase = require("firebase");
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



firebase.initializeApp({
    serviceAccount: "RedStarter-329502b8049c.json",
    databaseURL: "https://redstarter-b0908.firebaseio.com/"
});
var fireRef = firebase.database().ref('newUsers');

var port = process.env.PORT || 3000;

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

// app.get('/login', function (req, res) {
//     // fireRef.child("d").once('value', function (snapshot) {
//     //     console.log("DONE");
//     //     res.send("Hello");
//
//         // var correct = (snapshot.val() !== null && snapshot.val().info.password == req.body.thepass.toString() && req.body.thuser.toString() == snapshot.val().info.username);
//         // if (correct) {
//         //     currentuser = snapshot.val().info.username;
//         //     res.send({redirectUrl: "/landing.html"});
//         //
//         // } else {
//         //     correct = false;
//         // }
//         // if (!correct) {
//         //     res.send({redirectUrl: "" ,display: "inline", uerror: ["has-error", "inputError1", "Username/Password Incorrect"]});
//         // }
//     });
//
//
//
// });

app.get('/user', function (req, res) {
    console.log("Getting current user in the backend");
    res.send({user: currentuser});

});

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



app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
/**
 * Created by Henry on 10/24/2016.
 */
