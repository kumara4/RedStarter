$(document).ready(function () {
    var $first = $("#fn");
    var $last = $("#ln");
    var low = 1;
    var high = 100;
    function randomNum() {
        return Math.floor(Math.random() * high) + low;  //  generate random number to insert into username suggestion
    }
    /*
     * Dynamically creates ordered list objects based on user's input of first name and last name
     * and displays them. 
     */
    $("#ln").change(function () {
        $("#suggestun").append("<label id = \"selectid\" ><input type = \"radio\" > " + $first.val() + $last.val().substring(0, 1) + randomNum() + "</label><br>");
        $("#suggestun").append("<label id = \"selectid\"><input type = \"radio\" > " + $first.val().substring(0, 1) + $last.val() + randomNum() + "</label><br>");
        $("#suggestun").append("<label id = \"selectid\"><input type = \"radio\" > " + $last.val() + $first.val().substring(0, 1) + randomNum() + "</label><br>");
        $("#suggestun").append("<label id = \"selectid\"><input type = \"radio\" > " + $last.val().substring(0, 1) + $first.val() + randomNum() + "</label><br>");
    });
    /*
     * Uses data attribute to display pop-up message about form.
     */
    $("#help").click(function () {
        var $output = $("#help").data("help");
        alert($output);
    });
});
