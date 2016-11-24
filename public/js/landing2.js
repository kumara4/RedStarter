var count = 1;
var totalsearchitems = 0;
var counter = 0;
//Search term result data
var data = [];
var formdata = [];
var curruser = "";
var donedata = {"name": "flare", "children": []};
var circledata = {"name": "flare", "children": []};
var loggedin = false;

//Facebook terms
var fbterms = [];


//Initialize Firebase
var config = {
    apiKey: "AIzaSyCr2qQE1PIXTNcRMk5pAecHiiGKYqPp53U",
    authDomain: "redstarter-b0908.firebaseapp.com",
    databaseURL: "https://redstarter-b0908.firebaseio.com",
    storageBucket: "redstarter-b0908.appspot.com",
    messagingSenderId: "122153615057"
};

firebase.initializeApp(config);

var userName;

function setusernam(email){
    userName = email;
}
function getUser(){
    return userName;
}
//Authenticate whether a fb has authenticated
firebase.auth().onAuthStateChanged(function (user) {
    console.log("Hey state changed");
    //If there is a user in the state, state his credentials in the page
    if (user) {
        $("#header").show();
        $("#firebaseui-auth-container").hide();
        // User is signed in. Grab user information to user throughout the page
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        userName = user.uid;
        var providerData = user.providerData;
        var name = firebase.auth().currentUser;
        //Get user accessToken
        user.getToken().then(function (accessToken) {
            //Display user credentials on page
            document.getElementById('sign-in-status').textContent = "Welcome, " + displayName;
            // document.getElementById('account-details').textContent = JSON.stringify({
            //     displayName: displayName,
            //     email: email,
            //     emailVerified: emailVerified,
            //     photoURL: photoURL,
            //     uid: uid,
            //     accessToken: accessToken,
            //     providerData: providerData
            // }, null, '  ');
            setusernam(email);
            $.ajax({
                            url: "/savefbuser",
                            type: 'POST',
                            data: {token: accessToken},

                        });
        });

       //  console.log("Make cookie calls ");
       //  //Get User cookie which has User Likes
       // // var length = fbtermscookie.length;
       //  $.get("/getfbcookie", {token:"false", likes:'false'}).then(function (data) {
       //      console.log("Got cookie");
       //      //Call function to get fb like subreddit data
       //     // getFBSubreddits(data);
       //  });
    } else {
        console.log("Signed out");
        facebookSignout();
        window.location = "index.html";
    }
}, function (error) {
    console.log(error);
});


//Given user likes, call reddit API to get subreddits related to those likes
// function getFBSubreddits(data){
//     data = $.parseJSON(data);
//     var length = data.length;
//     console.log("fbternscookie length is " + length);
//     $.each(data, function (index, term) {
//         console.log("iterating through cookie object ");
//         $.ajax({
//             url: "https://www.reddit.com/subreddits/search/.json?q=" + term.name + "&sort=relevance&limit=8",
//             dataType: 'json',
//             cache: false,
//             success: function (output) {
//                 var parent={};
//                 var termchildren=[];
//                 $.each(output.data.children, function (ii, item) {
//                     if(item.data.id != null) {
//                         var sub = {
//                             sub: item.data.subscribers,
//                             url: item.data.url,
//                             display_name: item.data.display_name,
//                             id: item.data.id
//                         };
//                         termchildren.push(sub);
//                     }
//                 });
//                 if(termchildren.length >0) {
//                     parent['data'] = termchildren;
//                     parent['name'] = term.name;
//                     fbterms.push(parent);
//                     // console.log("parent is");
//                     // console.log(parent);
//                     displayFBterms(parent);
//                 }
//                 length--;
//                 if (length == 0) {
//                     console.log("Got terms!");
//                     console.log(fbterms);
//
//
//                 }
//             }.bind(this),
//             error: function (xhr, status, err) {
//                 console.error(this.props.url, status, err.toString());
//             }.bind(this)
//         });
//     });
//}

function facebookSignout() {
    firebase.auth().signOut()
        .then(function () {
            console.log('Signout successful!')

        }, function (error) {
            console.log('Signout failed')
        });
}
function createTodo(img) {
    if (img != "no" || $('#mimg').children.length == 0) {
        console.log($('#mimg').children.length);
        $('#musername').append(
            '<div id="mimg"><img src="' + img + '"</div>'
        );
    }
}

// function displayFBterms(cat){
//     console.log("setting view for " + cat.name);
//     $.each(cat.data, function(index, result){
//         // console.log("RESULT IS");
//         // console.log(result);
//         $('#sugresults').append(
//             '<div class="resultnode">' +
//             '<a class="sublink" href="https://www.reddit.com' + result.url.toString() + '">'+
//             result.display_name + '</a>   </div>');
//     });
//
// }






var LandingPage = React.createClass({
    getInitialState: function () {
        return {loggedin: "false", theuser: curruser, results: [], text: '', id: ++count, terms: []};
    },

    componentDidMount: function (e) {
        console.log("CALLING GET COOKIE from landing");
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("Hey state changed in landing");
            //If there is a user in the state, state his credentials in the page
            if (user) {
                //Get user accessToken
                user.getToken().then(function (accessToken) {
                    $.get("/getfbcookie", {token:accessToken, likes:'true'}).then(function (data) {
                        console.log("Got cookie in landpage cmd");
                        //Call function to get fb like subreddit data
                        console.log(data);
                    });
                });
            }
        });
        // $.get("/getfbcookie", {likes:"true"}).then(function (data) {
        //     console.log("Got cookie");
        //     //Call function to get fb like subreddit data
        //     getFBSubreddits(data);
        // });

    },

    render: function () {
        return (
            <div key={++count} className="landingpage">



                <SearchBox/>
                <div id="customcontainer" className="jumbotron">
                    <CustomBox/>
                </div>
                <TopicBox />
            </div>
        );
    }
});

var CustomBox = React.createClass({
    getInitialState: function () {
        return {results: [], text: '', id: ++count, terms: []};
    },
    // displayFBterms: function (cat){
    //     console.log("setting view for " + cat.name);
    //     $.each(cat.data, function(index, result){
    //         // console.log("RESULT IS");
    //         // console.log(result);
    //         $('#sugresults').append(
    //             '<div class="resultnode">' +
    //             '<a class="sublink" href="https://www.reddit.com' + result.url.toString() + '">'+
    //             result.display_name + '</a>   </div>');
    //     });
    //
    // },
    printTerms: function(){
        this.state.terms.map(function(term){

        });

    },
    getFBSubreddits: function (data){
        data = $.parseJSON(data);
        var length = data.length;

        data.map(function (term) {
            console.log("fbternscookie length is  IN CUSTOM BOX" + length);
                $.ajax({
                    url: "https://www.reddit.com/subreddits/search/.json?q=" + term.name + "&sort=relevance&limit=8",
                    dataType: 'json',
                    cache: false,
                    success: function (output) {
                        var parent = {};
                        var termchildren = [];
                        $.each(output.data.children, function (ii, item) {

                            if (item.data.id != null) {
                                var sub = {
                                    sub: item.data.subscribers,
                                    url: item.data.url,
                                    display_name: item.data.display_name,
                                    id: item.data.id
                                };
                                termchildren.push(sub);
                            }
                        });
                        if (termchildren.length > 0) {
                            parent['data'] = termchildren;
                            parent['name'] = term.name;
                            fbterms.push(parent);
                            var terms = this.state.terms;
                            terms.push(parent);
                            terms.sort(function(a, b) {
                                return parseFloat(a.data.length) - parseFloat(b.data.length);
                            });
                            this.setState({terms: terms});
                            // console.log("parent is");
                            // console.log(parent);
                           // this.displayFBterms(parent);
                        }
                        length--;
                        if (length == 0) {
                            console.log("Got terms IN CUSTOM BOX!");
                            //this.setState({terms: fbterms});
                            this.printTerms();
                            console.log(fbterms);


                        }
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
        }, this);
        // $.each(data, function (index, term) {
        //     console.log("iterating through cookie object ");
        //     $.ajax({
        //         url: "https://www.reddit.com/subreddits/search/.json?q=" + term.name + "&sort=relevance&limit=8",
        //         dataType: 'json',
        //         cache: false,
        //         success: function (output) {
        //             var parent = {};
        //             var termchildren = [];
        //             $.each(output.data.children, function (ii, item) {
        //                 if (item.data.id != null) {
        //                     var sub = {
        //                         sub: item.data.subscribers,
        //                         url: item.data.url,
        //                         display_name: item.data.display_name,
        //                         id: item.data.id
        //                     };
        //                     termchildren.push(sub);
        //                 }
        //             });
        //             if (termchildren.length > 0) {
        //                 parent['data'] = termchildren;
        //                 parent['name'] = term.name;
        //                 fbterms.push(parent);
        //                 // console.log("parent is");
        //                 // console.log(parent);
        //                 this.displayFBterms(parent);
        //             }
        //             length--;
        //             if (length == 0) {
        //                 console.log("Got terms!");
        //                 console.log(fbterms);
        //
        //
        //             }
        //         },
        //         error: function (xhr, status, err) {
        //             console.error(this.props.url, status, err.toString());
        //         }.bind(this)
        //     }.bind(this));
        // });
    },
    refreshLoadedData: function () {
        var user;

            $.get("/getfbcookie", {token:"false", likes:'false'}).then(function (data) {
                console.log("DATA GOTTEN FROM CUSTOMBOX GET REQUEST");
                //Call function to get fb like subreddit data
                this.getFBSubreddits(data);



            }.bind(this));





    },
    componentDidMount: function (e) {

        this.refreshLoadedData();

    },
    render: function () {
        console.log(this.state.terms[0]);
        return (
                <div key={++count} data-id= {this.state.terms.length} className="custom">
                    {this.state.terms.map(function (result) {
                        return(<CustomList name={result.name} data={result.data}/>)
                    })}


                </div>
        )

    }

});

var CustomList = React.createClass({

    render: function () {
        return (
            <div key={++count}  className="alike">
                <div className="alike-header">
                    <p>Because you like {this.props.name}</p>
                    </div>
                {
                    this.props.data.map(function (sub) {
                    return (


                    <Result key={++count} id={sub.id} display_name={sub.display_name}
                    url={sub.url}/>

                    );
                }
                    )
                }



            </div>
        );
    }
});

var SearchBox = React.createClass({
    getInitialState: function () {
        return {results: [], text: '', id: ++count, terms: []};
    },
    componentDidMount: function (e) {
        ReactDOM.findDOMNode(this.refs.searchInput).focus();
        this.refreshLoadedData(this.state.terms);

    },
    onChange: function (e) {
        e.preventDefault();
        this.setState({text: e.target.value});
    },
    deleteTerm: function (term) {
        var items = this.state.terms.filter(function (el) {
            return term.id !== el.id;
        });
        totalsearchitems--;
        this.setState({
            terms: items
        });
    },
    refreshLoadedData: function (terms) {
        if (terms.length > 0) {
            data = [];
            var num = 50 / totalsearchitems;
            counter = 0;
            terms.map(function (term) {
                counter++;
                $.ajax({
                    url: "https://www.reddit.com/subreddits/search/.json?q=" + term.text + "&sort=relevance&limit=" + num.toString(),
                    dataType: 'json',
                    cache: false,
                    success: function (output) {
                        $.each(output.data.children, function (ii, item) {

                            var sub = {
                                sub: item.data.subscribers,
                                url: item.data.url,
                                display_name: item.data.display_name,
                                id: item.data.id
                            };

                            data.push(sub);

                        });
                        // if (counter == terms.length) {
                        //     var temp = data;
                        //     this.work(temp);
                        // }

                        this.setState({results: data});

                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });

            }, this);

        } else {
            document.getElementById("circle").innerHTML = "";
        }
    },
    // work: function (data) {
    //     var items = {};
    //     circledata = {"name": "flare", "children": []};
    //     var items2 = {"name": "nametemp", "children": [{"name2": "nametemp2", "children": []}]};
    //
    //     data.forEach(function (item) {
    //         var chi = {"name": item.display_name, "url": item.url, "size": item.sub};
    //         items2.children[0].children.push(chi);
    //     });
    //     circledata.children.push(items2);
    //     // createCirclemap();
    // },
    searchTerms: function () {
        data = [];
        this.refreshLoadedData(this.state.terms);
    },
    handleNewWord: function (e) {

        e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13' && this.value != "") {
            totalsearchitems += 1;
            var nextTerms = this.state.terms.concat([{text: this.state.text, id: ++count}]);
            var nextText = '';
            this.setState({terms: nextTerms, text: nextText});
        }
    },
    handleAdd: function (prov) {
        prov.addScope('user_likes');
        firebase.auth().signInWithPopup(prov)
            .then(this.handleauth)
            .catch(function (error) {

                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(errorCode + ": ERROR WHEN AUTHENTICATING" + errorMessage);
            });


    },
    // handleauth(dat){
    //     console.log("LOGGGGGGG");
    //     var theuser = this.props.theuser;
    //     firebase.auth().currentUser.getToken().then(function (idToken) {
    //         $.ajax({
    //             url: "/savefbuser",
    //             type: 'POST',
    //             data: {user: theuser, token: idToken},
    //
    //         });
    //
    //     }.bind(this));
    //
    // },
    render: function () {

        return (
            <section className="jumbotron text-center button_search center ">
                <div className="row">
                    <div className="connecttofacebook">

                    </div>
                    <h3> Enter things you find interesting! Press enter to add each term to your list then click the Search</h3>
                    <div key={this.props.id} id="interest_list" className="searchBox interest_list">
                        <label>I like</label>
                        <input type="text" ref="searchInput" onChange={this.onChange}
                               onKeyUp={this.handleNewWord}
                               value={this.state.text} id="searchterms" placeholder=" dogs"/>
                        <p>Press enter to add term</p>
                        <SearchList terms={this.state.terms} deleteTerm={this.deleteTerm}/>
                        <button onClick={this.searchTerms} id="searchnow">Search for Subreddits</button>
                        <div id="circle"></div>
                        <ResultList results={this.state.results}/>
                    </div>
                </div>
            </section>);
    }
});

var ResultList = React.createClass({
    render: function () {
        return (
            <div key={++count} id="searchresults" className="searchresults">
                {this.props.results.map(function (result) {
                    return (
                        <Result key={result.id} id={result.id} display_name={result.display_name} url={result.url}/>
                    );
                })}
            </div>
        );
    }
});
var Result = React.createClass({
    getInitialState: function () {
        return {haveit:false, theuser: "tempuser", initial: 1};
    },
    setHaveit: function(){
        firebase.auth().onAuthStateChanged(function (user) {

            //If there is a user in the state, state his credentials in the page
            if (user) {

                var email = user.email.split("@")[0];
                console.log("email is set to " + email);
                var userRef = firebase.database().ref('newUsers/' + email+"/subreddits");
                userRef.child(this.props.id).once('value', function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    if(exists){

                        this.setState({haveit: true});


                    }

                }.bind(this));
            }
        }.bind(this));
    },
    componentWillMount: function (e) {
        this.setHaveit();



    },
    addSub: function () {
        var usernam = getUser();
        this.setState({haveit:true});
        firebase.auth().currentUser.getToken().then(function(idToken) {
            $.post("/addSub", {
                token: idToken,
                sub: this.props.display_name,
                subid: this.props.id
            });
        }.bind(this));

    },
    removeSub: function () {
        this.setState({haveit:false});
        firebase.auth().currentUser.getToken().then(function(idToken) {
            $.ajax({
                url: "/removeSub",
                type: 'DELETE',
                data: {token: idToken, sub: this.props.display_name, subid: this.props.id},
                success: function (output) {
                }.bind(this)
            });
        });

    },
    render: function () {



        return (

            <div key={this.props.id} data-id={this.state.haveit} className={!this.state.haveit ? 'resultnode': 'haveitresultnode'}>
                <a className="sublink" href={"https://www.reddit.com" + this.props.url}>

                    {this.props.display_name}


                </a>
                { this.state.haveit == false ? <a className="pluslink" onClick={this.addSub}>
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </a> : null }
                { this.state.haveit == true ? <a className="removelink" onClick={this.removeSub}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </a> : null }

            </div>



        );
    }
});


var SearchList = React.createClass({

    render: function () {

        var createItem = this.props.terms.map((term, index) => {

            return (
                <div key={term.id}>
                    <SearchListItem key={term.id} id={term.id} text={term.text} index={index}
                                    deleteTerm={this.props.deleteTerm.bind(null, term)}/>
                </div>

            );
        }, this);
        return (
            <div id="terms">My list of terms:
                {createItem}
            </div>

        );


    }

});


var SearchListItem = React.createClass({
    render: function () {
        return (
            <div key={this.props.id} className="termitems">
                <div className="searchterm termitem">{this.props.text}</div>
                <button id="deleteterm " onClick={this.props.deleteTerm}>✖</button>
            </div>
        );
    }
});


var TopicBox = React.createClass({
    getInitialState: function () {
        return {
            section: "top",
            id: count++,
            thedata: [{additional: [], ups: 0, permalink: "0", subreddit: "0", title: "0", id: 1}]
        };
    },

    refreshLoadedData: function (section) {

        $.ajax({
            url: "https://www.reddit.com/" + section + "/.json?&limit=25",
            dataType: 'json',
            cache: false,
            success: function (data) {
                var formatteddata = [];
                var subs = [];
                $.each(data.data.children, function (index, element) {
                    var el = {
                        additional: [],
                        id: element.data.id,
                        comments: element.data.num_comments,
                        title: element.data.title,
                        url: element.data.url,
                        permalink: element.data.permalink,
                        ups: element.data.ups,
                        subreddit: element.data.subreddit
                    };
                    //If data comment is from a subreddit that is already sotred, add it to that object instead of creating a new one
                    if (subs.includes(element.data.subreddit)) {
                        formatteddata[subs.indexOf(element.data.subreddit)].additional.push(el);
                    } else {
                        formatteddata.push(el);
                        subs.push(element.data.subreddit);
                    }
                });
                formdata = formatteddata;
                this.setState({thedata: formatteddata, id: count++});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.refreshLoadedData(this.state.section);
    },

    handleAdd: function (e) {
        e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        this.refreshLoadedData(e.target.value);


        formdata.forEach(function (item) {
            var items = {"name": item.subreddit, "children": []};
            var children = {"size": item.ups, "name": item.title, "url": item.url};
            items.children.push(children);
            if (item.additional.length > 0) {
                item.additional.forEach(function (child) {
                    var child = {"size": child.ups, "name": child.title, "url": child.url};
                    items.children.push(child);
                });

            }
            donedata.children.push(items);
            createTreemap();

        });


    },
    render: function () {
        ++count;
        return (

            <section className="visualizations2" id="visualizations2">
                <div key={this.props.id} className="TopicBox ">

                    <ul className="tabs text-center">
                        <li>
                            <button onClick={this.handleAdd} value="top" className="tab">Top</button>
                        </li>
                        <li>
                            <button onClick={this.handleAdd} value="rising" className="tab">Rising</button>
                        </li>
                        <li>
                            <button onClick={this.handleAdd} value="new" className="tab">New</button>
                        </li>
                        <li>
                            <button onClick={this.handleAdd} value="controversial" className="tab">Controversial
                            </button>
                        </li>
                        <li>
                            <button onClick={this.handleAdd} value="hot" className="tab">Hot</button>
                        </li>
                    </ul>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-offset-1 col-lg-10">
                                <h1 className="text-center">Subreddits with popular posts</h1>
                                <form>
                                    <label><input type="radio" name="mode" value="size" defaultChecked/> Size</label>
                                    <label><input type="radio" name="mode" value="count"/> Count</label>
                                </form>
                                <div id="graf" className="graf"></div>
                                <TopicList id={count} data={this.state.thedata}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        );
    }
});


var TopicList = React.createClass({
    render: function () {
        ++count;
        if (this.props.data != undefined) {

            var commmentNodes = this.props.data.map(function (comment) {
                if (comment.additional.length > 0) {
                    var morecommmentNodes = comment.additional.map(function (mcomment) {
                        return (
                            <Comment key={mcomment.id} comments={mcomment.comments} url={mcomment.url}
                                     moresubs={mcomment.additional} permalink={mcomment.permalink} ups={mcomment.ups}>
                                {mcomment.title}
                            </Comment>
                        );
                    });
                }

                return (
                    <div key={count++} className="cList">
                        <div className="col-sm-12 subredditTitle">
                            <a href={'https://www.reddit.com/r/' + comment.subreddit + "/"}>
                                <div className="cSubName">{comment.subreddit}
                                </div>
                            </a>
                        </div>
                        <Comment key={comment.id} comments={comment.comments} url={comment.url}
                                 moresubs={comment.additional} permalink={comment.permalink} ups={comment.ups}>
                            {comment.title}
                        </Comment>
                        {morecommmentNodes}


                    </div>
                );

            });


        }
        return (

            <div key={this.props.id} className="commentSubreddit ">
                {commmentNodes}

            </div>
        );
    }
});


// tutorial4.js
var Comment = React.createClass({
    render: function () {
        return (
            <div key={this.props.id} className=" col-lg-12 col-sm-12 cSubreddit">
                <div className="col-sm-2 col-lg-1 row-no-padding">

                    <div className="ups"><i className="fa fa-thumbs-up" aria-hidden="true"></i> {" " + this.props.ups}
                    </div>
                </div>
                <div className="col-sm-8 col-lg-10 ">
                    <div className="cTitle"><a href={this.props.url}>
                        {this.props.children}
                    </a>
                    </div>
                </div>
                <div className="col-sm-2 col-lg-1 row-no-padding">
                    <div className="cComNum"><a
                        href={'https://www.reddit.com' + this.props.permalink}><i className="fa fa-comment-o"
                                                                                  aria-hidden="true"></i> {" " + this.props.comments}
                    </a></div>
                </div>


            </div>

        );
    }
});

ReactDOM.render(
    <LandingPage />,
    document.getElementById('mainpage')
);
console.log("VIEW SUGGESTIONS");
console.log(fbterms.length);



function createTreemap() {


    var margin = {top: 40, right: 10, bottom: 10, left: 10},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category20c();

    var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function (d) {
            return d.size;
        });
    document.getElementById("graf").innerHTML = "";
    var div = d3.select("div.graf").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

    var root = donedata;
    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter()
        .append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function (d) {
            return d.children ? color(d.name) : null;
        })
        .text(function (d) {
            return d.children ? null : d.name;
        });

    d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
            ? function () {
            return 1;
        }
            : function (d) {
            return d.size;
        };

        node
            .data(treemap.value(value).nodes)
            .transition()
            .duration(1500)
            .call(position);
    });
    function position() {
        this.style("left", function (d) {
            return d.x + "px";
        })
            .style("top", function (d) {
                return d.y + "px";
            })
            .style("width", function (d) {
                return Math.max(0, d.dx - 1) + "px";
            })
            .style("height", function (d) {
                return Math.max(0, d.dy - 1) + "px";
            });
    }

}
function createCirclemap() {
    var diameter = 960,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);
    document.getElementById("circle").innerHTML = "";
    var svg = d3.select("#circle").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var root = circledata;


    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
            .filter(function (d) {
                return !d.children;
            }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function (d) {
            return d.className + ": " + format(d.value);
        });


    node.append("svg:a")
        .attr("xlink:href", function (d) {
            return "https://www.reddit.com/r/" + d.className + "/";
        })
        .append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d) {
            return color(d.packageName);
        })
        .attr("x", 100)
        .attr("y", 50)
        .attr("height", 100)
        .attr("width", 200)
        .style("fill", "lightgreen")

        .attr("rx", 10)
        .attr("ry", 10);

    node.append("svg:a")
        .attr("xlink:href", function (d) {
            return "https://www.reddit.com/r/" + d.className + "/";
        })
        .append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.className.substring(0, d.r / 3);
        })


// Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");
}