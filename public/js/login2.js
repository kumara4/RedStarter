var count = 1;
"use strict";
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCr2qQE1PIXTNcRMk5pAecHiiGKYqPp53U",
    authDomain: "redstarter-b0908.firebaseapp.com",
    databaseURL: "https://redstarter-b0908.firebaseio.com",
    storageBucket: "redstarter-b0908.appspot.com",
    messagingSenderId: "122153615057"
};
firebase.initializeApp(config);


var LoginBox = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {user: "", pass: "", newUsers: [], uerror: ["", "",""], display: "none"};
    },

    componentWillMount: function () {
        var ref = firebase.database().ref("newUsers");
        this.bindAsArray(ref, "newUsers");
    },


    validateLogin: function (e) {
        var user = this.refs.LoginUsername.state.user;
        var pass = this.refs.LoginPassword.state.pass;
        var correct = false;
        var usersRef = firebase.database().ref("newUsers");
        usersRef.child(user).once('value', function (snapshot) {
            console.log("");
            correct = (snapshot.val() !== null && snapshot.val().password == pass && user==snapshot.val().username);
            if (correct) {
                document.location.href = "landing.html";

            } else {
                correct = false;
            }
        });
        if (!correct) {
            this.setState({display: "inline", uerror: ["has-error", "inputError1", "Username/Password Incorrect"]})
        }


    },
    handleAdd: function (e) {
        e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        this.setState({user: this.state.user, pass: this.state.pass});
        this.accessFirebase(this.state.user, this.state.pass);


    },

    render: function () {
        ++count;

        return (

            <div key={this.props.id} className="row text-center LoginBox">
                <LoginUsername error={this.state.uerror}  ref="LoginUsername"/>
                <LoginPassword error={this.state.uerror}  ref="LoginPassword"/>

                <div className="col-lg-12">
                    <button className="btn btn-primary" onClick={this.validateLogin} id="login"> Login
                    </button>
                </div>

                <SignupBox ref="SignupBox"/>

            </div >
        );
    }
});


var LoginPassword = React.createClass({
    getInitialState: function () {
        return {pass: ""};
    },
    onChangePass: function (e) {

        e.preventDefault();
        this.setState({pass: e.target.value});
    },
    render: function () {
        var style={display: this.props.display};
        return (
            <div className={"col-lg-12 " + this.props.error[0]}>
                <label className={this.props.error[1]}>Password</label>
                    <input id="loginPW" className={this.props.error[1]} type="password" onChange={this.onChangePass}
                           value={this.state.pass} placeholder="Enter Password"/>
                    <p className="warning" style={style}>{this.props.error[2]}</p>
            </div>
        )
    }
});
var LoginUsername = React.createClass({
    getInitialState: function () {
        return {user: ""};
    },
    onChangeUser: function (e) {
        e.preventDefault();
        this.setState({user: e.target.value});
    },
    render: function () {
        var style={display: this.props.display};
        return (
            <div className={"col-lg-12 " + this.props.error[0]}>
                <label className={this.props.error[1]}>Username: </label>
                    <input id="loginUN" className={this.props.error[1]} onChange={this.onChangeUser} value={this.state.user}
                                        type="text" placeholder="Username"/>
                <p className="warning" style={style}>{this.props.error[2]}</p>
            </div>
        )
    }
});

var LoginForgot = React.createClass({

    render: function () {
        return (
            <div className="col-lg-12">
                <button type="button" className="btn btn-primary" id="forgotpw">Forgot Password</button>
            </div>
        )
    }
});


var SignupBox = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {user: "", pass: "", newUsers: [], existserror: ["", "",""],
            confirmpasserror: ["", "",""],
            confirmemailerror: ["", "",""],
            display: "none"};
    },

    componentWillMount: function () {
        var ref = firebase.database().ref("newUsers");
        this.bindAsArray(ref, "newUsers");
    },


    validateSignup: function (e) {
        var user = this.refs.SignupCredentials.state.user;
        var pass = this.refs.SignupCredentials.state.pass;
        var cpass = this.refs.SignupCredentials.state.passconfirm;
        var email = this.refs.SignupCredentials.state.email;
        var cemail = this.refs.SignupCredentials.state.confirmemail;
        var firstname = this.refs.SignupName.state.firstname;
        var lastname = this.refs.SignupName.state.lastname;


        var userexists = false;
        var usersRef = firebase.database().ref("newUsers");
        usersRef.child(user).once('value', function (snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                userexists = true;
            }
            if (userexists) {
                console.log("user exists");
                this.setState({display: "inline", existserror: ["has-error", "inputError1", "Username already exists"]})
            }
            else if(email != cemail){
                console.log("email not same");
                this.setState({display: "inline", confirmemailserror: ["has-error", "inputError1", "Emails do not match"]})
            }
            else if(pass != cpass){
                console.log("pass not same");
                this.setState({display: "inline", confirmpasserror: ["has-error", "inputError1", "Passwords do not match"]})
            }else {

        usersRef.child(user.toString()).set(
         {'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'username': user,
            'password': pass,
         });
                document.location.href = "landing.html";
        }


        },this);


    },
    render: function () {
        ++count;

        return (
            <div className="signup-section">
                <SignupName  ref="SignupName"/>

                <SignupCredentials  ref="SignupCredentials" display={this.state.display} existserror={this.state.existserror} confirmpasserror={this.state.confirmpasserror} confirmemailerror={this.state.confirmemailerror} />

                <div className="col-lg-12">

                        <button type="button" className="btn btn-primary" onClick={this.validateSignup} id="signupsubmit"> Signup
                        </button>

                </div>


            </div>

        );

    }


});


var SignupName = React.createClass({
    getInitialState: function () {
        return {lastname:"", firstname: ""};
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
                    <input id="name1" type="text" onChange={this.onChangefirst} value={this.state.value}placeholder="First Name"/>
                </div>
                <div className="lastname">
                    <label>Last Name:</label>
                    <input id="name2" type="text" onChange={this.onChangelast} value={this.state.value} placeholder="Last Name"/>
                </div>
            </div>
        )
    }
});


var SignupCredentials = React.createClass({
    getInitialState: function () {
        return {email:"",confirmemail:"",user: "", pass:"", passconfirm:""};
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
        var style={display: this.props.display};
        return (
            <div className="username-pass-fields">
                <div className={"row "+this.props.existserror[0]}>
                    <label className={this.props.existserror[1]}>Username</label>
                    <input id="username" className={this.props.existserror[1]} onChange={this.onChangeUser} value={this.state.value} placeholder="Username"/>
                    <p className="warning" style={style}>{this.props.existserror[2]}</p>
                </div>
                <div className="password-fields">
                    <div className={"row "+this.props.confirmpasserror[0]}>
                        <label className={this.props.confirmpasserror[1]}>Password</label>
                        <input id="password" className={this.props.confirmpasserror[1]} onChange={this.onChangePass} value={this.state.value} placeholder="Password"/>
                        <p className="warning" style={style}>{this.props.confirmpasserror[2]}</p>
                    </div>
                    <div className={"row "+this.props.confirmpasserror[0]}>
                        <label className={this.props.confirmpasserror[1]}>Confirm Password</label>
                        <input id="cpassword"  className={this.props.confirmpasserror[1]} onChange={this.onChangePassCon} value={this.state.value} placeholder="Confirm Password"/>


                    </div>
                    <div className={"row "+this.props.confirmemailerror[0]}>
                        <label className={this.props.confirmemailerror[1]}>Email:</label>
                        <input id="email" type="email" className={this.props.confirmemailerror[1]} onChange={this.onChangeEmail} value={this.state.value} placeholder="Email"/>
                        <p className="warning" style={style}>{this.props.confirmemailerror[2]}</p>
                    </div>
                    <div className="row">
                        <label className={this.props.confirmemailerror[1]}>Confirm Email:</label>
                        <input id="cemail" type="email"  className={this.props.confirmemailerror[1]} onChange={this.onChangeConEmail} value={this.state.value} placeholder="Confirm Email"/>

                    </div>
                </div>
            </div>

        )
    }
});




// tutorial4.js

ReactDOM.render(
    < LoginBox />, document.getElementById('signupbox')
);