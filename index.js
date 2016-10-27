var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
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

//Make a new one
app.post('/signup', function (req, res) {
    console.log("New req");
    console.log("Client wants to create todo: '" + req.body.todoText + "'");
    fireRef.child(req.body.user.toString()).set({"text": req.body.newuser}, function () {
        res.send("OK!");
    }).catch(function(){
        res.status(403);
        res.send();
    });
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
// app.get('/emptyHtml.html', function (req, res) {
//     console.log("Requested empty html");
//     res.send("OK!");
// });


app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});/**
 * Created by Henry on 10/24/2016.
 */
