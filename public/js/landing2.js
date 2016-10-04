var count = 1;


var TopicBox = React.createClass({
    getInitialState: function () {
        return {section: "top", id: count++, thedata: [{additional:[], ups: 0, permalink: "0", subreddit: "0", title: "0", id: 1}]};
    },

    refreshLoadedData: function(section){

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

    },
    render: function () {
        ++count;
        return (

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
                        <button onClick={this.handleAdd} value="controversial" className="tab">Controversial</button>
                    </li>
                    <li>
                        <button onClick={this.handleAdd} value="hot" className="tab">Hot</button>
                    </li>
                </ul>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-offset-1 col-lg-10">
                            <h1 className="text-center">Subreddits with popular posts</h1>
                            <TopicList id={count} data={this.state.thedata}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var TopicList = React.createClass({
    render: function () {
        ++count;
        if (this.props.data != undefined) {

            var commmentNodes = this.props.data.map(function (comment) {
                if(comment.additional.length > 0){
                    var morecommmentNodes = comment.additional.map(function (mcomment) {
                        return(
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
                            <a href={'https://www.reddit.com/r/' + comment.subreddit + "/"}><div className="cSubName">{comment.subreddit}
                            </div></a>
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

                    <div className="ups"><i className="fa fa-thumbs-up" aria-hidden="true"></i> {" " + this.props.ups}</div>
                </div>
                <div className="col-sm-8 col-lg-10 ">
                    <div className="cTitle"><a href={this.props.url}>
                        {this.props.children}
                    </a>
                </div>
                </div>
                <div className="col-sm-2 col-lg-1 row-no-padding">
                    <div className="cComNum"><a
                        href={'https://www.reddit.com' + this.props.permalink}><i className="fa fa-comment-o" aria-hidden="true"></i> {" " + this.props.comments}</a></div>
                </div>




            </div>

        );
    }
});


ReactDOM.render(
    <TopicBox />,
    document.getElementById('visualizations2')
);