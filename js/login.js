$(document).ready(function () {

    var $emailinput = $("<input id=\"email1\" type = \"email\" placeholder = \"Enter email here\" ><br>");
    var $cancelb = $("<button id = \"cb\" >Cancel</button>");
    var $submit = $("<button id = \"sb\">Submit</button>");
    var $forgotpwmessage = $("<label class = \"hinttext\" >Enter email address so we can send you a password reset link.</label><br>");
    /*
     * Show Sign Up Modal (when Sign Up button on Log In is clicked).
     */
    $("#signup-l").click(function () {
        $("#signUpModal").modal();
    });
    /*
     *  Dynamically creates label and input field to enter email for "forgot password"
     *  Also removes fields if user clicks the Cancel button. 
     */
    $("#forgotpw").click(function () {
        $("#pwModal").modal();
        $("#forgotpw").prop("disabled", true);
        $("#resetpw").append($forgotpwmessage);
        $("#resetpw").append($emailinput);
        $("#resetpw").append($submit);
        $("#resetpw").append($cancelb);
        $("#sb").prop("disabled", false);
        $("#sb").click(function () {    //  Submit button: submit email
            if (!$('#email1').val()) {
                alert("Please enter a valid email.");
            } else {
                $("#sb").prop("disabled", true);
                $("#resetpw").append("<br>Please check your email for a password reset link.");
            }
            $("#cb").html('Done');  //  once email is submitted, "Cancel" button changes to "Done" 
                                    //  Same functionality: close modal.
        });
        $("#cb").click(function () {    //  Candel button: Clear password reset info. Close Modal
            $("#resetpw").empty();
            $("#forgotpw").prop("disabled", false);
            $('#pwModal').modal('hide');

        });
    });
    /*
     * Uses data attribute to display pop-up message about form.
     */
    $("#help").click(function () {
        var $output = $("#help").data("help");
        alert($output);
    });
    $("#login").click(function () { //  take user to landing page
        alert("loggin in");
    })

});

    