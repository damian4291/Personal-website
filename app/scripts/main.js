$(function(){
    // Material UI click style effect
    clickEffect('.click__effect a', 650);
    mainMenu();
});


// Material UI click style effect
function clickEffect(element, delay) {
    var ink, d, x, y;
    var removeElem = setTimeout(function() {
        $('.clicked').remove();
    }, delay);

    $(element).click(function(e) {


        if($(this).find(".clicked").length === 0) {
            $(this).prepend("<span class='clicked'></span>");
        }

        ink = $(this).find(".clicked");
        ink.removeClass("clicked--animate");

        if(!ink.height() && !ink.width()){
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            ink.css({height: d, width: d});
        }

        x = e.pageX - $(this).offset().left - ink.width()/2;
        y = e.pageY - $(this).offset().top - ink.height()/2;

        ink.css({top: y + 'px', left: x + 'px'}).addClass("clicked--animate");

        clearTimeout(removeElem);

        removeElem = setTimeout(function() {
            $('.clicked').remove();
        }, delay);
    });
}


function mainMenu() {

    $('.menu__item').children('a')
        .click(function() {
            if( $(this).parent().children('ul').length > 0) {
                $(this)
                    .parent()
                    .toggleClass('expanded')
            }
        })
}
