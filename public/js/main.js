$(document).ready(function() {
    $('.section').hide();
});

$('.meal').click(function() {
    $.ajax({
        url: '/meal',
        type: 'POST'
    });
    //update the last meal time on the current page
    $('.last-meal').text(moment(new Date()).format("dddd, h:mm A"));
    $('.countdown').text(moment(new Date()).add(20, 'minutes').format('h:mm A'));
});

$('.trick').click(function() {
    var trick = $(this).find('.key').text().toLowerCase();
    console.log(trick);
    $.ajax({
        url: '/tricks/' + trick,
        type: 'POST'
    });
    $(this).find('.count').text((parseInt($(this).find('.count').text()) + 1));
});

$('.navbar-btn').click(function() {
    var selectedSection = $(this).attr('id');
    $('.section').hide();
    $('.' + selectedSection).fadeIn();
});
