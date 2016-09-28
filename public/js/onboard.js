$(document).ready(function() {});

$('.submit').click(function(event) {
    event.preventDefault();
    var palName = $('#pal-name').val();
    var pupName = $('#pup-name').val();
    $('input').val('');
    if (palName && pupName) {
        console.log(palName, pupName);
        $.ajax({
            url: '/onboard',
            data: {
                palName: palName,
                pupName: pupName
            },
            type: "POST"
        }).done(function() {
            window.location.replace("/main");
        });

    }
});
