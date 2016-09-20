$(document).ready(function() {

	var sections = ['top', 'rising', 'new', 'controversial', 'hot'];
	var tablename;
	var newrow;
	var subredditname;
	var commentcount;
	var ups;
	var score = [];
	var scoretag;
	$('.showdata').click(function($e) {
		$e.preventDefault();
		var panelcontent = $(this).parent().children('.content');
		if (panelcontent.is(':visible')) {
			panelcontent.css('display', 'none');
		} else {
			panelcontent.css('display', 'inline');
		}

	});

	/*Traverse the canned data and grab the subreddits that are associated with eah post in the data.
	 * Add this to the table on each section on the page*/
	$.each(sections, function(i, section) {
		var url = "https://www.reddit.com/" + section + "/.json?jsonp=?";
		score.push(0);
		$.getJSON(url, function(output) {

			//Display the subreddits of the rising posts
			$.each(output.data.children, function(ii, item) {
				//track the subreddit with the largest score in this section
				if (score[score.length - 1] < item.data.score) {
					score[score.length - 1] = item.data.score;
				}

				//Create a new tr and td element to add to table
				newrow = document.createElement("tr");
				subredditname = document.createElement("td");
				commentcount = document.createElement("td");
				ups = document.createElement("td");

				//Add text to the td
				subredditname.appendChild(document.createTextNode(item.data.subreddit));
				commentcount.appendChild(document.createTextNode(item.data.num_comments));
				ups.appendChild(document.createTextNode(item.data.ups));

				//add the td's to the tr
				newrow.appendChild(subredditname);
				newrow.appendChild(commentcount);
				newrow.appendChild(ups);

				//Add the tr after the last tr in the table
				tablename = "#" + section + "table" + " tr:last";
				$(tablename).after(newrow);

			});
			scoretag = document.createElement("p");
			scoretag.appendChild(document.createTextNode(score[score.length - 1]));
			var scorelocation = "#" + section + "score";
			$(scorelocation).append(scoretag);
		});
	});

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

