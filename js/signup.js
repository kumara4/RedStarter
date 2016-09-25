$(document).ready(function () {
    var $first = $("#name1");
    var $last = $("#name2");
    var low = 1;
    var high = 100;
    function randomNum() {
        return Math.floor(Math.random() * high) + low;  //  generate random number to insert into username suggestion
    }
    /*
     * Dynamically creates ordered list objects based on user's input of first name and last name
     * and displays them. 
     */
    $("input[id^='name']").change(function () {
        $("#suggestun").empty();
        $("#suggestun").append("<ol><label for = \"b1\"><input id = \"b1\" type = \"radio\"> " + $first.val() + $last.val().substring(0, 1) + randomNum() + "</label></ol>");
        $("#suggestun").append("<ol><label for = \"b2\"><input id = \"b2\" type = \"radio\"> " + $first.val().substring(0, 1) + $last.val() + randomNum() + "</label></ol>");
        $("#suggestun").append("<ol><label for = \"b3\"><input id = \"b3\" type = \"radio\"> " + $last.val() + $first.val().substring(0, 1) + randomNum() + "</label></ol>");
        $("#suggestun").append("<ol><label for = \"b4\"><input id = \"b4\" type = \"radio\"> " + $last.val().substring(0, 1) + $first.val() + randomNum() + "</label></ol>");
        $("#un").val("");
        /*
         * User may only select one username. And when selected it fills the textbook Username
         */
        $('input[type=radio]').prop('checked', false);
        $('input[type=radio]').click('change', function () {
            $('input[type=radio]').not(this).prop('checked', false);
            var idVal = $('input[type=radio]:checked').attr("id");
            var $val = $("label[for='" + idVal + "']").text();
            $("#un").val($val);
        });
    });
    $("#un").change(function () {
        $('input[type=radio]').prop('checked', false);
    })
    /*
     * Uses data attribute to display pop-up message about password requiments.
     */
    $("#help").click(function () {
        var $output = $("#help").data("help");
        alert($output);
    });
    /*
     * Pop up alert, if emails entered do not match
     */
    $("#signup").click(function (evt) {
        if ($('#email1').val() != $('#email2').val()) {
            alert('Emails mismatch');
            evt.preventDefault();
        }
        if (!$('#un').val()) {
            alert('Please enter a username');
        }
    });
});
