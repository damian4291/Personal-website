(function($, window, document) {

    var globals = {
        mobile:     Modernizr.mq('(max-width: 47.9375em)'), /* max 767px */
        tablet:     Modernizr.mq('(min-width: 48em) and (max-width: 61.9375em)'), /*  min 768px & max 991px */
        minTablet:  Modernizr.mq('(min-width: 48em)'), /* min 768px */
        dekstop:    Modernizr.mq('(min-width: 62em)') /* min 992px */
    }

    $(function() {
        clickEffect('.click__effect a', 600, false);
        menuDropdownToggle();
        scrollDown('.arrow_scroll--down', 650);
    });

    // Material UI click style effect
    function clickEffect(element, delay, centered) {
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

            if (centered === true) {
                // Set centered position
                x = - (elem.outerWidth() / 2);
                y = - (elem.outerHeight() / 2);

                // Apply cursor position to the element
                circle
                    .addClass('clicked--animate')
                    .css({
                        marginLeft: x,
                        marginTop: y,
                        top: '50%',
                        left: '50%'
                    });
            } else {
                // Define cursor click position
                x = e.pageX - elem.offset().left - circle.width() / 2;
                y = e.pageY - elem.offset().top - circle.height() / 2;

                // Apply cursor position to the element
                circle
                    .addClass('clicked--animate')
                    .css({
                        top: y,
                        left: x
                    });
            }

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

    // Class toggler for navigation
    function toggleElem(trigger, element, listElem, multiple) {
        // On click toggle class for list element
        trigger.click(function(e) {
            e.preventDefault();
            element.toggleClass('expanded');

            if ( element.hasClass('expanded') ) {
                trigger.attr('aria-expanded', true);
            } else {
                trigger.attr('aria-expanded', false);
            }

            // Prevent toggling more than one dropdown
            if ( multiple === false ) {
                $(listElem).not(element).removeClass('expanded');
            }
        });
    }

    // Main navigation construction
    function menuDropdownToggle() {

        $('.menu__item').each(function() {
            var elem = $(this),
                elemLink = elem.children('a')

            // Check if element has dropdown menu
            if ( elem.children('.dropdown__menu').length ) {

                // Append icon to the end of list element if child dropdown exists and apply ARIA tags
                elemLink
                    .append('<i class="fa fa-chevron-right dropdown--icon right small" />')
                    .attr({
                        'role': 'button',
                        'aria-haspopup': true,
                        'aria-expanded': false
                    });

                // Create toggler for first level dropdown.
                toggleElem(elemLink, elem, '.menu__item', false);

                var dropdownElem = elem.find('.sub--menu__item');
                dropdownElem.each(function(e) {
                    var dropElem = $(this),
                        dropLink = dropElem.children('a');

                    // Check if element has dropdown menu
                    if ( dropElem.children('.sub--dropdown__menu').length ) {

                        dropLink.append('<i class="fa fa-chevron-right dropdown--icon right small" />');

                        // Create toggler for first level dropdown.
                        toggleElem(dropLink, dropElem, '.sub--menu__item', true);
                    }
                });
            }
        });

        // Close dropdown by clicking outside of element
        $(document).on('click',function(e) {
            if ( $('.menu__item').hasClass('expanded') && !$(e.target).is('.menu__item *') ) {
                $('.menu__item').removeClass('expanded');
            }
        });
    }

    // Smooth scroll down from welcome section
    function scrollDown(element, delay) {
        $(element).click(function(e) {
            var elem = $(this),
                mainOffset = $('.main__container').find('.section__container:eq(1)').offset().top,
                headerHeight = $('.header__container').outerHeight();

            e.preventDefault();

            // animated scroll to the second content section with header offset
            $('body', 'html').animate({
                scrollTop: mainOffset - headerHeight
            }, delay);

            clickEffect(elem, 600, true);
        });
    }
}(window.jQuery, window, document));
