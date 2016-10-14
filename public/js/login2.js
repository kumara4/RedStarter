var count = 1;
"use strict";

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
        return {user: "", pass: "", newUsers: []};
    },

    componentWillMount: function () {
        var ref = firebase.database().ref("newUsers");
        this.bindAsArray(ref, "newUsers");
    },

    onChangeUser: function (e) {
        this.setState({user: e.target.value});
    },

    onChangePass: function (e) {
        this.setState({pass: e.target.value});
    },
    validateLogin: function (e) {


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
                <LoginUsername ref="LoginUsername"/>
                <LoginPassword ref="LoginPassword"/>
                <LoginSubmit ref="LoginSubmit" validateUser={this.validateLogin}/>
                <LoginForgot ref="LoginForgot"/>
                <SignupBox ref="SignupBox"/>
            </div >
        );
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
var LoginSubmit = React.createClass({
    render: function () {
        return (
            <div className="col-lg-12">
                <a href="landing.html">
                    <button type="button" className="btn btn-primary" onClick={this.handleAdd} id="login"> Login
                    </button>
                </a>
            </div>
        )
    }
});
var LoginPassword = React.createClass({
    getInitialState: function () {
        return {pass: ""};
    },
    render: function () {
        return (
            <div className="col-lg-12">
                <label>Password: <input id="loginPW" type="password" onChange={this.onChangePass}
                                        value={this.state.pass} placeholder="Enter Password"/></label>
            </div>
        )
    }
});
var LoginUsername = React.createClass({
    getInitialState: function () {
        return {user: ""};
    },
    render: function () {
        return (
            <div className="col-lg-12">
                <label>Username: <input id="loginUN" onChange={this.onChangeUser} value={this.state.user}
                                        type="text" placeholder="Username"/></label>
            </div>
        )
    }
});
var SignupBox = React.createClass({


    render: function () {
        ++count;

        return (
            <div className="signup-section">
                <SignupName />
                <SignupUsername />
                <SignupEmail />
                <SignPassword />

            </div>

        );

    }


});


var SignupName = React.createClass({
    getInitialState: function () {
        return {name: ""};
    },
    render: function () {
        return (
            <div className="fullname-fields">
                <div className="firstname">
                    <label>First Name:</label>
                    <input id="name1" type="text" placeholder="First Name"/>
                </div>
                <div className="lastname">
                    <label>Last Name:</label>
                    <input id="name2" type="text" placeholder="Last Name"/>
                </div>
            </div>
        )
    }
});
var SignupEmail = React.createClass({

    render: function () {
        return (
            <div className="email-fields">
                <div className="row">
                    <label>Email:</label>
                    <input id="email" type="email" placeholder="Email"/>
                </div>
                <div className="row">
                    <label>Confirm Email:</label>
                    <input id="cemail" type="email" placeholder="Confirm Email"/>

                </div>
            </div>
        )
    }
});
var SignPassword = React.createClass({
    render: function () {
        return (
            <div className="password-fields">
                <div className="row">
                    <label>Password</label>
                    <input id="password" placeholder="Password"/>
                </div>
                <div className="row">
                    <label>Confirm Password</label>
                    <input id="cpassword" placeholder="Confirm Password"/>

                </div>
            </div>
        )
    }
});
var SignupUsername = React.createClass({
    render: function () {
        return (
            <div className="username-fields">
                <div className="row">
                    <label>Username</label>
                    <input id="username" className="username" placeholder="Username"/>
                </div>
            </div>
        )
    }
});


// tutorial4.js

ReactDOM.render(
    < LoginBox />, document.getElementById('signupbox')
);