$(document).ready(function() {

	// Initialize Firebase
	var config = {
		apiKey : "AIzaSyCr2qQE1PIXTNcRMk5pAecHiiGKYqPp53U",
		authDomain : "redstarter-b0908.firebaseapp.com",
		databaseURL : "https://redstarter-b0908.firebaseio.com",
		storageBucket : "redstarter-b0908.appspot.com",
		messagingSenderId : "122153615057"
	};
	firebase.initializeApp(config);

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

	var subredditRef = firebase.database().ref("subreddits");
	subredditRef.remove();

	function saveData(tempurl) {
		nexturl = tempurl;
		count--;
		if (count != 0) {
			//grabData(nexturl, section);
		}

	}


	$('.showdata').click(function($e) {

		$e.preventDefault();
		var panelcontent = $(this).parent().children('.content');
		if (panelcontent.is(':visible')) {
			panelcontent.css('display', 'none');
		} else {
			panelcontent.css('display', 'inline');
		}
		//grab the section name from the xxxxxstats div

		section = $(this).parent().attr('id').replace('SR', '');
		defaulturl = "https://www.reddit.com/" + section + "/.json?&limit=100";
		grabData(defaulturl, section);

	});

	function recordScore(score, section) {
		var scorelocation = "#" + section + "score";

		scoretag = document.createElement("p");
		scoretag.appendChild(document.createTextNode(score));

		$(scorelocation).append(scoretag);

	}

	function grabData(url, section) {
		var thesection = section;

		subcontainer = {};

		/*Traverse the data and grab the subreddits that are associated with eah post in the data.
		 * Add this to the table on each section on the page*/
		var sub = {};

		$.getJSON(url, function(output) {

			saveData("https://www.reddit.com/" + thesection + "/.json?&limit=100&after=" + output.data.after);
			var sub = {},
				key;
			$.each(output.data.children, function(ii, item) {
				total = total + 1;
				//track the subreddit with the largest score in this section
				if (score < item.data.score) {
					score = item.data.score;
				}

				//store data in database, tracking each subreddit's total viewers, total followers and each post

				var fredNameRef = new Firebase('https://redstarter-b0908.firebaseio.com/subreddits');
				fredNameRef.child(thesection).set({});
				sub[item.data.subreddit] = {};

				var existsRef = new Firebase('https://redstarter-b0908.firebaseio.com/subreddits/'+thesection);
				fredNameRef.once("value", function(snapshot) {
					var a = snapshot.child(item.data.subreddit).exists();
					if(a ==true){
						alert(a);
					}

				});

				sub[item.data.subreddit] = {
					"subreddit": item.data.subreddit,
					"ups": item.data.ups,
					"comments": item.data.num_comments,
					"url": item.data.url,
					"posts": {
						"id": item.data.id,
						"title": item.data.title,
						"url": item.data.url
					}
				};
				fredNameRef.child(thesection).set(sub);
			});

		addRow();

			});
			recordScore(score, thesection);


		}



	// subredditRef.on("child_added", function(data) {
	// 	addRow(data.val(), data.key);
	// });

	function addRow() {
		var tempcount = 0;
		//Add the tr after the last tr in the table
		tablename = "#" + section + "table" + " tr:last";


		var ref = new Firebase('https://redstarter-b0908.firebaseio.com/subreddits/'+section);
		ref.once("value", function(snapshot) {
			// The callback function will get called twice, once for "fred" and once for "barney"
			snapshot.forEach(function(childSnapshot) {
				newrow = document.createElement("tr");
				// key will be "fred" the first time and "barney" the second time
				var key = childSnapshot.key();
				// childData will be the actual contents of the child
				var childData = childSnapshot.val();

					$(newrow).append('<td class="subreddit" data-index =' + key + '>' + childData.subreddit + '</td>');
					$(newrow).append('<td class="num_comments" data-index =' + key + '>' + childData.comments + '</td>');
					$(newrow).append('<td class="ups" data-index =' + key + '>' + childData.ups + '</td>');
					$(tablename).after(newrow);
					tempcount++;




			});
		});






	}

	/*Allow for multiple views, TOPSCORE view will display info about the top subreddit and information about the section.
	 * Stats will contain graphs related to posts that are the most popular in this section*/

	function show(id) {
		$('.tab')//Select all elements with tab class
			.removeClass('selected')//From that set, remove the class "selected" from all
			.filter //Now filter all of the tabs by the function below
			(function() {
				return (this.hash === id);
			}) //From the link that has the same # mark as what was clicked, add the selected tag
			.addClass('selected');

		$('.panel')//Select all elements with panel class
			.hide()//Hide all of them
			.filter(id)//Select just the one with the given id
			.show();
		//Unhide it
	}

	//Set a listener so that when we change the #... part of it, we call the function above
	$(window).on('hashchange', function($e) {
		$e.preventDefault();
		show(location.hash);
	});

	// initialise by showing the first panel
	show('#topscore');

});

