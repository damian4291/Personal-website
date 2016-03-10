(function($, window, document) {

    $(function(){
        clickEffect('.click__effect a', 600);
        menuDropdownToggle();
    });

    // Material UI click style effect
    function clickEffect(element, delay) {
        var circle, d, x, y, removeElem;

        $(element).click(function(e) {
            var elem = $(this);

            // Check if there is existing element
            if(elem.find('.clicked').length === 0) {
                elem.append('<span class="clicked" />');
            }

            circle = elem.find('.clicked');
            circle.removeClass('clicked--animate');

            // Set equal height & width using largest value of element height/width
            if( !circle.height() && !circle.width() ) {
                d = Math.max( elem.outerWidth(), elem.outerHeight() );
                circle.css({
                    height: d,
                    width: d
                });
            }

            // Define cursor click position
            x = e.pageX - elem.offset().left - circle.width() / 2;
            y = e.pageY - elem.offset().top - circle.height() / 2;

            // Apply cursor clicked position to the element
            circle.addClass('clicked--animate')
            .css({
                top: y + 'px',
                left: x + 'px'
            });

            // Renew timeout for clickable link.
            clearTimeout(removeElem);

            // Remove last clicked link after timeout.
            removeElem = setTimeout(function() {
                elem.find('.clicked').remove();
            }, delay);

            // Remove element from former link.
            $(element).not(this).find('.clicked').remove();
        });
    }

    // Main navigation dropdown toggle
    function menuDropdownToggle() {
        $('.menu__item').children('a').click(function(e) {
            var elem = $(this),
                listElem = elem.parent();

            // If element has child list then toggle class.
            if ( listElem.children('ul').length > 0) {
                e.preventDefault();
                listElem.toggleClass('expanded');

                // Prevent open more than one dropdown.
                $('.menu__item').not(listElem).removeClass('expanded');
            }
        });

        // Close dropdown by clicking outside of element
        $(document).click(function(e) {
            if( !$(e.target).is('.menu__item *') ) {
                $('.menu__item').removeClass('expanded');
            }
        });
    }
}(window.jQuery, window, document));
