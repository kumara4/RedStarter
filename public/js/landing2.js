var count = 1;
var totalsearchitems = 0;
var counter = 0;
var data = [];
var formdata = [];
var curruser = "";
var donedata = {"name": "flare", "children": []};
var circledata = {"name": "flare", "children": []};
var loggedin=false;


function createTodo(img)
{
    if(img != "no" || $('#mimg').children.length ==0)
    {
        console.log($('#mimg').children.length);
        $('#musername').append(
            '<div id="mimg"><img src="'+img+'"</div>'
        );
    }
}


var LandingPage = React.createClass({
    getInitialState: function () {
        return {theuser: curruser, results: [], text: '', id: ++count, terms: []};
    },
    setUser: function (user) {
        if(!loggedin){
            loggedin=true;
            console.log("IN SET USER " + user);
            this.setState({theuser: user});
            $.get("http://localhost:3000/img", {user: user}).then(function (data) {
                createTodo(data.img);

            });



        }

    },
    componentDidMount: function (e) {
        console.log("CALLING GET COOKIE from landing");
        $.get("http://localhost:3000/cookie", {}).then(function (data) {
            this.setUser(data.user);
        }.bind(this));
    },
    render: function () {
        return (
            <div key={++count} className="landingpage">

                <div className="alien_img">
                    <img src="img/alien.png"/>
                </div>
                <div className="profile">
                    <div id="musername">
                        <p>{this.state.theuser}</p>
                    </div>
                </div>
                <SearchBox theuser={this.state.theuser}/>
                <TopicBox />
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
                        if (counter == terms.length) {
                            var temp = data;
                            this.work(temp);
                        }

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
    work: function (data) {
        var items = {};
        circledata = {"name": "flare", "children": []};
        var items2 = {"name": "nametemp", "children": [{"name2": "nametemp2", "children": []}]};

        data.forEach(function (item) {
            var chi = {"name": item.display_name, "url": item.url, "size": item.sub};
            items2.children[0].children.push(chi);
        });
        circledata.children.push(items2);
        // createCirclemap();
    },
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
    render: function () {
        return (
            <section className="jumbotron text-center button_search center ">
                <div className="row">
                    <div className="connecttofacebook">
                        <button className="facebookbutton">
                            Connect with Facebook
                        </button>
                    </div>
                    <h3> Or enter a list of your interests to get recommended subreddits!</h3>
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
        return {theuser: "", donthave: true, initial: 1};
    },
    setUser: function (user) {
        console.log("IN SET USER " + user);
        this.setState({initial: 0, theuser: user});
    },
    addSub: function () {
        this.setState({donthave: false});
        $.post("http://localhost:3000/addSub", {
            user: this.state.theuser,
            sub: this.props.display_name,
            subid: this.props.id
        });
    },
    removeSub: function () {
        this.setState({donthave: true});
        $.ajax({
            url: "http://localhost:3000/removeSub",
            type: 'DELETE',
            data: {user: this.state.theuser, sub: this.props.display_name, subid: this.props.id},
            success: function (output) {
            }.bind(this)
        });
    },
    render: function () {
        if (this.state.initial == 1) {
            $.get("http://localhost:3000/cookie", {}).then(function (data) {
                this.setUser(data.user);

            }.bind(this));
        }

        return (

            <div key={this.props.id} className="resultnode">
                <a className="sublink" href={"https://www.reddit.com" + this.props.url}>

                    {this.props.display_name}

                </a>
                { this.state.donthave ? <a className="pluslink" onClick={this.addSub}>
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </a> : null }
                { this.state.donthave == false ? <a className="removelink" onClick={this.removeSub}>
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
    <LandingPage />

    ,
    document.getElementById('mainpage')
);


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