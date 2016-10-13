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
        var usersRef = firebase.database().ref('logins');
        var renderLanding = false;
        var MyModal = React.createClass({
        getInitialState(){
        return {showModal: false};
        },
                close(){
        this.setState({ showModal: false});
        },
                open(){
        this.setState({ showModal: true});
        },
                render: function () {
                ++count;
                        return (
                                < div className = "usersignup" style = {divStyle} >
                                < div className = "container" >
                                < div className = "row" >
                                < div className = "col-sm-12 col-lg-offset-1 col-lg-10" >
                                < div className = "row" >
                                < div > First Name:
                                < input id = "name1" type = "text" placeholder = "First Name" / >
                                < /div>
                                < /div>
                                < div className = "row" >
                                < div > Last Name:
                                < input id = "name2" type = "text" placeholder = "Last Name" / >
                                < /div>
                                < /div>
                                < div className = "row" >
                                < div > Username:
                                < input id = "un" type = "text" placeholder = "Username" / >
                                < /div>
                                < /div>
                                < div className = "row" >
                                < div > Email:
                                < input id = "email1" type = "email" placeholder = "Email" / >
                                < /div>
                                < /div>
                                < div className = "row" >
                                < div > Re - enter Email:
                                < input id = "email2" type = "email" placeholder = "Confirm Email" / >
                                < /div>
                                < /div>
                                < div className = "row" >
                                < div > New Password:
                                < input id = "newpw" type = "password" placeholder = "New Password"
                                pattern = "[a-z]{1,15}"
                                title = "Password must have at least 6 characters; may contain upper and lower case and digits 0-9." / >
                                < button type = "button" className = "btn btn-default btn-sm " id = "help"
                                data = "Password must have at least 6 characters; may contain upper and lower case and digits 0-9." >
                                < span className = "glyphicon glyphicon-info-sign" > < /span>
                                < /button>
                                < /div>
                                < /div>
                                < div className = "row" >
                                < button className = "btn btn-primary " id = "signup" onClick = {this.signUp} > Sign Up < /button>
                                < /div>

                                < /div>

                                < /div>
                                < /div>
                                < /div>
                                );
                }
        });
        var LoginBox = React.createClass({

        mixins: [ReactFireMixin],
                getInitialState: function () {
                return {user: "", pass: ""};
                },
                accessFirebase: function (user, pass) {

                var ref = firebase.database().ref("users");
                        //Verify user already exists

                        ref.push({
                        'username': user,
                                'password': pass,
                        });
                },
                onChangeUser: function (e) {
                this.setState({user: e.target.value});
                },
                onChangePass: function (e) {
                this.setState({pass: e.target.value});
                },
                signUp: function (e) {

                $(".usersignup").css("display", "inline");
                },
                handleAdd: function (e) {
                e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
                        this.setState({user: this.state.user, pass: this.state.pass});
                        this.accessFirebase(this.state.user, this.state.pass);
                },
                componentWillMount: function () {
                var ref = firebase.database().ref("users");
                },
                render: function () {
                ++count;
                        return (
                                < div key = {this.props.id} className = "row text-center LoginBox" >
                                < div className = "col-lg-12" >
                                < label > Username: < input id = "loginUN" onChange = {this.onChangeUser} value = {this.state.user}
                        type = "text" placeholder = "Username" / > < /label>
                                < /div>
                                < div className = "col-lg-12" >
                                < label > Password: < input id = "loginPW" type = "password" onChange = {this.onChangePass}
                        value = {this.state.pass} placeholder = "Enter Password" / > < /label>
                                < /div>

                                < div className = "col-lg-12" >
                                < a href = "landing.html" > < button type = "button" className = "btn btn-primary" onClick = {this.handleAdd} id = "login" > Login < /button></a >
                                < /div>
                                < div className = "col-lg-12" >
                                < button type = "button" className = "btn btn-primary" id = "forgotpw" > Forgot Password < /button>
                                < /div>
                                < div className = "col-lg-12" >
                                < button type = "button" className = "btn btn-primary" onClick = {this.signUp} id = "signup-l" > Sign Up
                                < /button>
                                < /div>
                                < MyModal >
                                < /MyModal>
                                < /div>
                                );
                }
        });
        var divStyle = {
        display: 'none'
        };
// tutorial4.js
        var UserSuggestion = React.createClass({
        render: function () {
        return (
                < div key = {this.props.id} className = " col-lg-12 col-sm-12 suggestun" >
                < /div>

                );
        }
        });
        ReactDOM.render(
                < LoginBox / > , document.getElementById('signupbox')
                );