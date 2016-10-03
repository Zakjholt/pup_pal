$('.meal').click(function() {
    $.ajax({
        url: '/meal',
        type: 'POST'
    });
    //update the last meal time on the current page
    $('.last-meal').text(moment(new Date()).format("dddd, h:mm A"));
    $('.countdown').text(moment(new Date()).add(20, 'minutes').format('h:mm A'));
});

$('.pet-care-button').click(function(event) {
    event.preventDefault();
    var showSection = $(this).text().replace(" ", "-");
    $('.pet-care-button').removeClass('selected');
    $(this).addClass('selected');
    $('article').hide();
    $('article.' + showSection).fadeIn();
});

$('.navbar-btn').click(function(event) {
    event.preventDefault();
    var selectedSection = $(this).attr('id');
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    $('section').hide();
    $('article').hide();
    $('.' + selectedSection).fadeIn();
});

$('.training').on('click', '.trick', function(event) {
    event.preventDefault();
    var trick = $(this).find('.key').text().toLowerCase();
    console.log(trick);
    $.ajax({
        url: '/tricks/' + trick,
        type: 'POST'
    });
    $(this).find('.count').text((parseInt($(this).find('.count').text()) + 1));
});


$('.add-trick').click(function(event) {
    event.preventDefault();
    var newTrick = $('.template').clone();
    var trickName = $('.trick-name').val();
    $('.trick-name').val('');
    var lowerCaseName = trickName.toLowerCase();

    newTrick.find('.key').text(trickName);
    newTrick.find('.count').text(0);

    newTrick.removeClass('template').appendTo('.training');

});

$('.training').on('mouseenter', '.trick-container', function() {
    $(this).find('.delete-trick').fadeIn(200);
}).on('mouseleave', '.trick-container', function() {
    $(this).find('.delete-trick').fadeOut(200);
});



$('.training').on('click', '.delete-trick', function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('delete!');
    var trickName = $(this).siblings('.trick').find('.key').text().toLowerCase();
    console.log(trickName);
    $(this).closest('div').remove();
    $.ajax({
        url: '/tricks/' + trickName,
        type: 'DELETE'
    });

});

$(document).ready(function() {
    var user = $.parseJSON($('#user').val());
    makeCards(user.tricks);
});

//Function expects the tricks object
function makeCards(tricks) {
    console.log(tricks);
    if ($.isEmptyObject(tricks)) {
        tricks = {
            'sit': 0,
            'stay': 0,
            'come': 0,
            'down': 0
        };
    }
    for (var i in tricks) {
        var newTrick = $('.template').clone();
        var trickName = i.charAt(0).toUpperCase() + i.slice(1);
        var trickCount = tricks[i];
        newTrick.find('.key').text(trickName);
        newTrick.find('.count').text(trickCount);
        newTrick.removeClass('template').appendTo('.training');
    }
}
