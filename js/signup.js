$(document).ready(function() {
	var $first = $("#fn");
	var $last = $("#ln");
	var low = 1;
	var high = 100;
	function randomNum() {
		return Math.floor(Math.random() * high) + low;
		//  generate random number to insert into username suggestion
	}

	/*
	 * Dynamically creates ordered list objects based on user's input of first name and last name
	 * and displays them.
	 */
	$("#ln").change(function() {
		$("#suggestun").append("<ol> " + $first.val() + $last.val().substring(0, 1) + randomNum() + "</ol>");
		$("#suggestun").append("<ol> " + $first.val().substring(0, 1) + $last.val() + randomNum() + "</ol>");
		$("#suggestun").append("<ol> " + $last.val() + $first.val().substring(0, 1) + randomNum() + "</ol>");
		$("#suggestun").append("<ol> " + $last.val().substring(0, 1) + $first.val() + randomNum() + "</ol>");
	});
	/*
	 * Uses data attribute to display pop-up message about form.
	 */
	$("#help").click(function() {
		var $output = $("#help").data("help");
		alert($output);
	});
});
