$(document).ready(function(){
    var $emailinput = $("<input type = \"email\" placeholder = \"Enter email here\" ><br>");
    var $cancelb = $("<button id = \"cb\">Cancel</button>");
    var $submit = $("<button id = \"sb\">Submit</button>");
    /*
     *  Dynamically creates label and input field to enter email for "forgot password"
     *  Also removes fields if user clicks the Cancel button. 
     */
    $("#forgotpw").one('click',function(){ 
        $("#resetpw").append("<label class = \"hinttext\" >Enter email address so we can send you a password reset link.</label><br>");
        $("#resetpw").append($emailinput);
        $("#resetpw").append($submit);
        $("#resetpw").append($cancelb);
            $("#sb").click(function(){
                $("#resetpw").append("<br>Please check your email for a password reset link."); 
            });
            $("#cb").click(function(){
                $("#resetpw").remove();
            });
    });
    /*
     * Uses data attribute to display pop-up message about form.
     */
    $("#help").click(function(){
        var $output = $("#help").data("help");
        alert($output);
    });
});

    