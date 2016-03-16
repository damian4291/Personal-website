(function($, window, document) {

    var globals = {
        mobile:     '(max-width: 47.9375em)', /* max 767px */
        tablet:     '(min-width: 48em) and (max-width: 61.9375em)', /*  min 768px & max 991px */
        minTablet:  '(min-width: 48em)', /* min 768px */
        desktop:    '(min-width: 62em)', /* min 992px */
        isWebkit:   'WebkitAppearance' in document.documentElement.style
    }

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
                x = elem.outerWidth() / 2;
                y = elem.outerHeight() / 2;

                // Apply cursor position to the element
                circle
                    .addClass('clicked--animate')
                    .css({
                        marginLeft: - x,
                        marginTop: - y,
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
            var elem        = $(this),
                elemLink    = elem.children('a')

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

    // Smooth scroll to section via href target
    function scrollToSection(element, delay) {
        $(element).click(function(e) {
            var elem            = $(this),
                target          = $(this).attr('href'),
                headerHeight    = $('.header__container').outerHeight(),
                body            = (globals.isWebkit) ? $('body') : $('html');

            e.preventDefault();

            // Prevent double click which destroys animate scroll
            if( !elem.data('clicked') ) {
                // trigger animation if window scroll top position isn't equal element offset top
                if( $(window).scrollTop() + headerHeight != $(target).offset().top) {

                    // animated scroll to the second content section with header offset
                    body.stop(true, true).animate({
                        scrollTop: $(target).offset().top - headerHeight
                    }, delay);

                }

                // Mark to ignore next click
                elem.data('clicked', true);

                // Unmark after 1,5 second
                setTimeout(function() {
                    elem.removeData('clicked');
                }, 1500)
            }

            // Stop the animation if the user scrolls manually (only during the animation)
            body.on('scroll wheel DOMMouseScroll mousewheel touchmove', function() {
                $(this).stop();
                elem.removeData('clicked');
            });
        });
    }


    function backToTop(element) {
        // Toggle class for element if its not mobile device and scroll top of screen is in half of second section.
        function fadeElem() {
            var screenScroll = $(window).scrollTop(),
                sectionHeight = $('#welcome__section').outerHeight();

            // Only on desktops and in half of second section
            if ( Modernizr.mq(globals.desktop) && screenScroll >= sectionHeight / 2 ) {
                $(element).addClass('visible');

            } else {
                $(element).removeClass('visible');
            }
        }

        // Initialize function
        fadeElem();

        // Update element on scroll
        $(document).on('scroll', fadeElem);

        // Check if resolution is not mobile
        $(window).on('resize', fadeElem);
    }

    // Auto generate currect year for copyright
    function updateYear(element) {
        var fullDate = new Date(),
            ActualYear = fullDate.getFullYear();

        $(element).text(ActualYear);
    }

    function simpleModal() {
        var body = $('body'),
            item = $('.work__box');

        item.each(function() {
            var elem = $(this),
                target = elem.attr('href');

            $(target).addClass('modal-off');

            // Click element to trigger modal
            elem.click(function(e) {
                var modal_id = $(this).attr('href'),
                    close = $('.modal').find('.close__button');

                // Unfocus modal trigger element
                $(this).blur();

                // Close modall
                close.click(function(e) {
                    close_modal(modal_id);
                    e.preventDefault();
                });

                // Check if target element exists
                if( $(modal_id).length ) {

                    body.addClass('overflow-hidden');

                    $(modal_id)
                        .removeClass('modal-off')
                        .addClass('modal-on fadeIn active')
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                            $(this).removeClass('fadeIn');
                        });
                }

                e.preventDefault();
            });

            function close_modal(modal_id) {
                body.removeClass('overflow-hidden');

                $(modal_id)
                    .removeClass('modal-on')
                    .addClass('modal-off fadeOut')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                        $(this).removeClass('fadeOut active');
                    });
            }
        });
    }

    var wow = new WOW({
        boxClass: 'work__box',
        animateClass: 'box__loaded',
        offset: 125
    });

    // When DOM is ready...
    $(function() {
        clickEffect('.click__effect a, .button', 600, false);
        menuDropdownToggle();
        scrollToSection('.scroll--link', 650);
        updateYear('.copyright__year');
        backToTop('.top--scroller');
        simpleModal();
        wow.init();
    });

}(window.jQuery, window, document));
