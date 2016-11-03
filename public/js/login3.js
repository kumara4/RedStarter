"use strict";
var count = 1;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCr2qQE1PIXTNcRMk5pAecHiiGKYqPp53U",
    authDomain: "redstarter-b0908.firebaseapp.com",
    databaseURL: "https://redstarter-b0908.firebaseio.com",
    storageBucket: "redstarter-b0908.appspot.com",
    messagingSenderId: "122153615057"
};
firebase.initializeApp(config);



var provider = new firebase.auth.FacebookAuthProvider();
//  get user's likes: https://developers.facebook.com/docs/facebook-login/permissions
provider.addScope('user_likes');
// Initialize the FirebaseUI Widget using Firebase.
firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    if(user){
        var userName = user.uid;
        var displayName = user.displayName;
        var email = user.email;
        console.log(displayName + ' Signed in via Facebook. Email: ' + email);
        console.log(userName);
        window.location = 'landing.html';
    }
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
});


function facebookSignout() {
    firebase.auth().signOut()

        .then(function () {
            console.log('Signout successful!')
        }, function (error) {
            console.log('Signout failed')
        });
}