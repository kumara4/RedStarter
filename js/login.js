$(document).ready(function () {
    
    var $emailinput = $("<input id=\"email1\" type = \"email\" placeholder = \"Enter email here\" ><br>");
    var $cancelb = $("<button id = \"cb\">Cancel</button>");
    var $submit = $("<button id = \"sb\">Submit</button>");
    var $forgotpwmessage = $("<label class = \"hinttext\" >Enter email address so we can send you a password reset link.</label><br>");
    /*
     *  Dynamically creates label and input field to enter email for "forgot password"
     *  Also removes fields if user clicks the Cancel button. 
     */
//    $("#forgotpw").one('click', function () {
    $("#signup-l").click(function () {
        $("#myModal").modal();
    });
    $("#forgotpw").click(function () {
        $("#forgotpw").prop("disabled", true);
        
        $("#resetpw").append($forgotpwmessage);
        $("#resetpw").append($emailinput);
        $("#resetpw").append($submit);
        $("#resetpw").append($cancelb);
        $("#sb").prop("disabled", false);
        $("#sb").click(function () {
            if (!$('#email1').val()) {
                alert("Please enter a valid email.");
            } else {
                $("#sb").prop("disabled", true);
                $("#resetpw").append("<br>Please check your email for a password reset link.");
            }
        });
        $("#cb").click(function () {
            $("#resetpw").empty();
            $("#forgotpw").prop("disabled", false);
        });
    });
    /*
     * Uses data attribute to display pop-up message about form.
     */
    $("#help").click(function () {
        var $output = $("#help").data("help");
        alert($output);
    });
    $("#login").click(function () {
        alert("loggin in");
    })

});

    