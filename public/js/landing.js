$(document).ready(function () {
    "use strict";
    // Initialize Firebase
    // var config = {
    //     apiKey: "AIzaSyCr2qQE1PIXTNcRMk5pAecHiiGKYqPp53U",
    //     authDomain: "redstarter-b0908.firebaseapp.com",
    //     databaseURL: "https://redstarter-b0908.firebaseio.com",
    //     storageBucket: "redstarter-b0908.appspot.com",
    //     messagingSenderId: "122153615057"
    // };
    // firebase.initializeApp(config);

    //GLOBAL VARIABLES
    var sections = ['top', 'rising', 'new', 'controversial', 'hot'];
    var tablename;
    var newrow;
    var ups;
    var score = 0;
    var defaulturl;
    var count = 5;
    var nexturl;
    var scoretag;
    var section;
    var total = 0;
    var termsarray = [];
    //ACCESS FIREBASE SUBREDDIT DATABASE
    // var subredditRef = firebase.database().ref("subreddits");
    // subredditRef.remove();
    //
    // //MAKE MULTIPLE CALLS TO GET MORE THAN 100 ENTIRES OF DATA
    // function saveData(tempurl) {
    //     nexturl = tempurl;
    //     count--;
    //     if (count != 0) {
    //         //grabData(nexturl, section);
    //     }
    //
    // }
    //
    //
    //
    //
    //
    // //SEARCH TERMS BUTTON PRESSED: Get terms entered by usre and call grabData() with a call for each term entered
    // $('.interest_list').on('click', '#searchnow', function () {
    //     document.getElementById('searchresults').innerHTML = "";
    //     if ($(".termitem").length) {
    //         var termsarray = document.getElementsByClassName("searchterm");
    //
    //         $.each(termsarray, function (i, term) {
    //
    //             grabData({
    //                 type: "search",
    //                 iurl: "https://www.reddit.com/subreddits/search/.json?q=" + $(term).text() + "&sort=relevance&limit=" + 50 / $(".termitem").length
    //             });
    //         });
    //     } else {
    //         alert("Enter your favorite things so we can suggest subreddits!");
    //     }
    //
    // });
    //
    //
    // function grabData(arg) {
    //     var thesection;
    //     var theurl = arg.iurl;
    //
    //
    //     /*Traverse the data and grab the subreddits that are associated with eah post in the data.
    //      * Add this to the table on each section on the page*/
    //     var sub = {};
    //     score = 0;
    //
    //     $.getJSON(theurl, function (output) {
    //
    //
    //         var sub = {};
    //
    //         $.each(output.data.children, function (ii, item) {
    //
    //             $(document.getElementById('searchresults')).append('<a href="https://www.reddit.com' + item.data.url + '"> <div class="suggestedSub">' + item.data.display_name + '</div>');
    //
    //
    //         });
    //
    //
    //     });
    //
    //
    // }




});



