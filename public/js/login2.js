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

FB.init({
    appId: '1799926606953024',
    status: true,
    xfbml: true,
    version: 'v2.7' // or v2.6, v2.5, v2.4, v2.3
});


var currentuser = firebase.auth().currentUser;
var check = 0;
console.log("CURRENT USER");
console.log(currentuser);
var node = [];

var help = [];
var finaltermcount;


function storenames(term, i) {
    help.push(term);
    if(finaltermcount-1 == i){
        gotolanding();
    }
}
function getpages(term, token){
    finaltermcount = term.length;
    console.log("finalterm count is " + finaltermcount);
    $.each(term, function (i, value) {
        FB.api('/' + value.id, {fields: 'name', access_token: token}, function (response2) {
            storenames(response2, i);
        });

    });


}

function gotolanding(){
    console.log("see help" + help.length + " " );
    console.log(help);
    $.ajax({
        type: "GET",
        url: "/fbcookie",
        data: {hi: help},
        success: function (output) {
            window.location = 'landing.html';
        }
    });



}

firebase.auth().onAuthStateChanged(function (user) {

    if (currentuser) {
        window.location = 'landing.html';
    }
    if (check == 0) {


        if (user) {
             
            check++;
            var provider = new firebase.auth.FacebookAuthProvider();
            //  get user's likes: https://developers.facebook.com/docs/facebook-login/permissions
            provider.addScope('user_likes');
            // Initialize the FirebaseUI Widget using Firebase.
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                console.log(result);
                console.log("UID IS IN LOGIN");
                console.log(result.user.providerData[0].uid);

                //Save the uid in the provder data which is needed to access the FB API in the backend
                $.get("/fbuidcookie", {fbuid: result.user.providerData[0].uid }).then(function (data) {
                    console.log("SAVED FBUID");
                 //   window.location = "landing.html";
                    //Call function to get fb like subreddit data
                });
                //GRAB THE USER'S LIKED AGES AND STORE THEM AS A COOKIE

                var fb = FB.api(result.user.providerData[0].uid + '/likes', {
                    fields: 'user_likes',
                    access_token: token
                }, function (response) {
                    getpages(response.data, token);
                    var names=[];
                    function storenames(name){
                        names.push(name);

                    }

                    
                    console.log(response.data);




                });






            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
        } else {
            console.log("Signed out");
            // User is signed out.
            $("#header").hide();
            console.log("FirebaseUI config.");
            var uiConfig = {
                'signInSuccessUrl': '/', //URL that we get sent BACK to after logging in
                'signInOptions': [
                    // Leave the lines as is for the providers you want to offer your users.
                    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    {
                        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                        scopes: [
                            'public_profile',
                            'email',
                            'user_likes',
                            'user_friends',
                            'user_about_me'
                        ]
                    }

//            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//            firebase.auth.GithubAuthProvider.PROVIDER_ID,
//                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                // Terms of service url.
                'tosUrl': '<your-tos-url>',
            };
            console.log(uiConfig);
            console.log("Initializing UI");
            // Initialize the FirebaseUI Widget using Firebase.
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            console.log("Initialized UI");
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
            console.log("Started UI");
            $("#container").hide();
        }
    }
}, function (error) {
    console.log(error);
});


var LoginBox = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {uid: '', user: "", pass: "", newUsers: [], uerror: ["", "", ""], display: "none"};
    },

    componentWillMount: function () {
        //  this.usersRef = firebase.database().ref("newUsers");
        // firebase.auth().onAuthStateChanged(function(user) {
        //     console.log("user login cpmincount " );
        //     console.log(user);
        //     if (user) {
        //         this.handleauth(user);
        //     } else {
        //         // No user is signed in.
        //     }
        // }.bind(this));
    },
    onChangePass: function (e) {

        e.preventDefault();
        this.setState({pass: e.target.value});
    },
    onChangeUser: function (e) {
        e.preventDefault();
        this.setState({user: e.target.value});
    },

    validateLogin: function (e) {
        var user = this.state.user;
        var pass = this.state.pass;
        var correct = false;
        $.get("/login", {user: user, pass: pass}).then(function (data) {
            console.log("THE URL IS " + data.url);

            if (data.url == null || data.url == "") {
                this.setState({display: "inline", uerror: ["has-error", "inputError1", "Username/Password Incorrect"]});
            } else {
                document.location.href = data.url;
            }
        }.bind(this));


    },



    render: function () {
        ++count;
        var style = {display: this.props.display};

        return (

            <div key={this.props.id} className="row text-center LoginBox">
                {/*<div className="col-lg-12">*/}
                {/*<button className="btn btn-primary auth" onClick={this.handleAdd.bind(this, new firebase.auth.FacebookAuthProvider())} id="login">Signin with Facebook</button>*/}
                {/*</div>*/}
                <div className={"col-lg-12 " + this.state.uerror[0]}>
                    <label className={this.state.uerror[1]}>Username: </label>
                    <input id="loginUN" className={this.state.uerror[1]} onChange={this.onChangeUser}
                           value={this.state.user}
                           type="text" placeholder="Username"/>
                    <p className="warning" style={style}>{this.state.uerror[2]}</p>
                </div>
                <div className={"col-lg-12 " + this.state.uerror[0]}>
                    <label className={this.state.uerror[1]}>Password</label>
                    <input id="loginPW" className={this.state.uerror[1]} type="password"
                           onChange={this.onChangePass}
                           value={this.state.pass} placeholder="Enter Password"/>
                    <p className="warning" style={style}>{this.state.uerror[2]}</p>
                </div>

                <div className="col-lg-12">
                    <button className="btn btn-primary" onClick={this.validateLogin} id="login">Login</button>
                </div>

                <SignupBox ref="SignupBox"/>

            </div >
        );
    }
});


var SignupBox = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {
            user: "", pass: "", newUsers: [], existserror: ["", "", ""],
            confirmpasserror: ["", "", ""],
            confirmemailerror: ["", "", ""],
            display: "none"
        };
    },

    componentWillMount: function () {
        //this.usersRef = firebase.database().ref("newUsers");
        //this.bindAsArray(this.usersRef, "newUsers");
    },


    validateSignup: function (e) {
        e.preventDefault();

        console.log("ENTERED VALIDATESIGNUP");
        var user = this.refs.SignupCredentials.state.user;
        var pass = this.refs.SignupCredentials.state.pass;
        var cpass = this.refs.SignupCredentials.state.passconfirm;
        var email = this.refs.SignupCredentials.state.email;
        var cemail = this.refs.SignupCredentials.state.confirmemail;
        var firstname = this.refs.SignupName.state.firstname;
        var lastname = this.refs.SignupName.state.lastname;


        // var userexists = false;
        //  this.usersRef = firebase.database().ref("newUsers");

        if (user == "" || pass == "" || cpass == "" || email == "" || cemail == "" || firstname == "" || lastname == "") {
            this.setState({
                display: "inline",
                existserror: ["has-error", "inputError1", "Username already exists"]
            })

        }
        if (user != "") {
            console.log("ENTERED BEFORE USEREF");


            var formData = new FormData($("#newItemForm")[0]);
            $.ajax({
                type: "POST",
                url: "/signup",
                data: formData, processData: false,
                contentType: false,
                success: function (output) {
                    if (output.error == "exists") {
                        console.log("user exists");
                        this.setState({
                            display: "inline",
                            existserror: ["has-error", "inputError1", "Username already exists"]
                        })
                    }
                    else if (output.error == "confirmemail") {
                        console.log("email not same");
                        this.setState({
                            display: "inline",
                            confirmemailserror: ["has-error", "inputError1", "Emails do not match"]
                        })
                    }
                    else if (output.error == "confirmpass") {
                        console.log("pass not same");
                        this.setState({
                            display: "inline",
                            confirmpasserror: ["has-error", "inputError1", "Passwords do not match"]
                        })
                    } else if (output.error == "blank") {
                        alert("You must fill in all fields");

                    } else {
                        window.location = output.redirectUrl;
                    }

                }.bind(this)

            });


        }


    },
    render: function () {
        ++count;
        return (
            <div className="signup-section">
                <div className="col-lg-12">
                    <form id="newItemForm" encType="multipart/form-data">
                        <SignupName ref="SignupName"/>
                        <SignupCredentials ref="SignupCredentials" display={this.state.display}
                                           existserror={this.state.existserror}
                                           confirmpasserror={this.state.confirmpasserror}
                                           confirmemailerror={this.state.confirmemailerror}/>
                        <input ref="file" type="file" id="newFile" name="img"/>
                        <input className="btn btn-primary" onClick={this.validateSignup} id="signupsubmit" type="button"
                               value="Signup"/>
                    </form>
                </div>
            </div>
        );
    }
});


var SignupName = React.createClass({
    getInitialState: function () {
        return {lastname: "", firstname: ""};
    },
    onChangefirst: function (e) {
        e.preventDefault();
        this.setState({firstname: e.target.value});
    },
    onChangelast: function (e) {
        e.preventDefault();
        this.setState({lastname: e.target.value});
    },
    render: function () {
        return (
            <div className="fullname-fields">
                <div className="firstname">
                    <label>First Name:</label>
                    <input id="name1" name="firstname" type="text" onChange={this.onChangefirst}
                           value={this.state.value}
                           placeholder="First Name"/>
                </div>
                <div className="lastname">
                    <label>Last Name:</label>
                    <input id="name2" name="lastname" type="text" onChange={this.onChangelast} value={this.state.value}
                           placeholder="Last Name"/>
                </div>
            </div>
        )
    }
});


var SignupCredentials = React.createClass({
    getInitialState: function () {
        return {email: "", confirmemail: "", user: "", pass: "", passconfirm: ""};
    },
    onChangeUser: function (e) {
        e.preventDefault();
        this.setState({user: e.target.value});
    },
    onChangePass: function (e) {
        e.preventDefault();
        this.setState({pass: e.target.value});
    },
    onChangePassCon: function (e) {
        e.preventDefault();
        this.setState({passconfirm: e.target.value});
    },
    onChangeEmail: function (e) {
        e.preventDefault();
        this.setState({email: e.target.value});
    },
    onChangeConEmail: function (e) {
        e.preventDefault();
        this.setState({confirmemail: e.target.value});
    },
    render: function () {
        var style = {display: this.props.display};
        return (
            <div className="username-pass-fields">
                <div className={"row " + this.props.existserror[0]}>
                    <label className={this.props.existserror[1]}>Username</label>
                    <input name="username" id="username" className={this.props.existserror[1]}
                           onChange={this.onChangeUser}
                           value={this.state.value} placeholder="Username"/>
                    <p className="warning" style={style}>{this.props.existserror[2]}</p>
                </div>
                <div className="password-fields">
                    <div className={"row " + this.props.confirmpasserror[0]}>
                        <label className={this.props.confirmpasserror[1]}>Password</label>
                        <input name="password" id="password" className={this.props.confirmpasserror[1]}
                               onChange={this.onChangePass} value={this.state.value} placeholder="Password"/>
                        <p className="warning" style={style}>{this.props.confirmpasserror[2]}</p>
                    </div>
                    <div className={"row " + this.props.confirmpasserror[0]}>
                        <label className={this.props.confirmpasserror[1]}>Confirm Password</label>
                        <input id="cpassword" name="cpassword" className={this.props.confirmpasserror[1]}
                               onChange={this.onChangePassCon} value={this.state.value}
                               placeholder="Confirm Password"/>


                    </div>
                    <div className={"row " + this.props.confirmemailerror[0]}>
                        <label className={this.props.confirmemailerror[1]}>Email:</label>
                        <input id="email" name="email" type="email" className={this.props.confirmemailerror[1]}
                               onChange={this.onChangeEmail} value={this.state.value} placeholder="Email"/>
                        <p className="warning" style={style}>{this.props.confirmemailerror[2]}</p>
                    </div>
                    <div className="row">
                        <label className={this.props.confirmemailerror[1]}>Confirm Email:</label>
                        <input id="cemail" name="cemail" type="email" className={this.props.confirmemailerror[1]}
                               onChange={this.onChangeConEmail} value={this.state.value}
                               placeholder="Confirm Email"/>

                    </div>

                </div>
            </div>

        )
    }
});


// tutorial4.js

// ReactDOM.render(
//     < LoginBox />, document.getElementById('signupbox')
// );

