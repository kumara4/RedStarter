
"use strict";
var count = 1;












var LoginBox = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {uid:'',user: "", pass: "", newUsers: [], uerror: ["", "", ""], display: "none"};
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
                document.location.href = data.url;}
        }.bind(this));


    },

    // handleauth(dat){
    //     var authData = dat.user || dat;
    //    // IN HERE SET IT UP SO WHEN i RETEIVE FACEBOOK DATA, I AM ABLE TO CHECK DATABSE TO SE IF USER EXISTS, IF NOT SAVE HIM TO DB AND PROCEED TO LANDING
    //     var userRef = firebase.database().ref('newUsers/' + authData.uid);
    //     userRef.on('value',(snapshot) => {
    //         var data = snapshot.val() || {};
    //         if(!data.uid){
    //             userRef.set({
    //                 uid: authData.uid,
    //                 email: authData.email,
    //                 photo: authData.photoURL,
    //                 name: authData.displayName
    //             });
    //         }
    //         this.setState({
    //             uid: authData.uid,
    //
    //         });
    //         window.location = "landing.html";
    //     });
    //     console.log("GOT DATA");
    //     console.log(authData);
    // },

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

ReactDOM.render(
    < LoginBox />, document.getElementById('signupbox')
);

