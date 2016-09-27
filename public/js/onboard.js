$(document).ready(function() {});

$('.submit').click(function(event) {
    event.preventDefault();
    var palName = $('#pal-name').val();
    var pupName = $('#pup-name').val();
    $('#pal-name').val('');
    $('#pup-name').val('');
    if (palName && pupName) {
        console.log(palName, pupName);
        $.ajax({
            url: 'onboard',
            data: {
                palName: palName,
                pupName: pupName
            },
            type: "POST"
        });
    }
});
