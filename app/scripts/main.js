(function($, window, document) {

    'use strict';

    var globals = {
        mobile:     '(max-width: 47.9375em)', /* max 767px */
        landscape:  '(max-width: 47.9375em) and (max-height: 23.4375em)', /* max 767px & 375px */
        tablet:     '(min-width: 48em) and (max-width: 61.9375em)', /*  min 768px & max 991px */
        minTablet:  '(min-width: 48em)', /* min 768px */
        desktop:    '(min-width: 62em)', /* min 992px */
        isWebkit:   'WebkitAppearance' in document.documentElement.style
    };

    Handlebars.registerHelper('imgModal', function() {
        var dekstop_img = Handlebars.escapeExpression(this.Modal.ImgUrl),
            mobile_img = Handlebars.escapeExpression(this.Modal.MobileImgUrl),
            img_alt = Handlebars.escapeExpression(this.Modal.ImgAlt);

        // Check if mobile (touch) device and return different image
        if ( typeof window.ontouchstart === 'object' ) {
            return new Handlebars.SafeString('<img  class="modal__image" src="' + mobile_img + '" alt="' + img_alt + '" />');
        } else {
            return new Handlebars.SafeString('<img  class="modal__image" src="' + dekstop_img + '" alt="' + img_alt + '" />');
        }
    });

    // Render handlebars templates via AJAX
    function getTemplateAjax(path, callback) {
        var source, template;
        $.ajax({
            url: path,
            success: function(data) {
                source = data;
                template = Handlebars.compile(source);
                if (callback) callback(template);
            }
        });
    }

    // Function to render compiled handlebars templates
    function renderHandlebarsTemplate(withTemplate, inElement, withData) {
        getTemplateAjax(withTemplate, function(template) {
            $(inElement).html(template(withData));
        });
    }

    // Render compiled handlebars templates
    function renderDataVisualsTemplate(data) {
        renderHandlebarsTemplate('templates/projectTemplate.hbs', '#projects__items', data);
        renderHandlebarsTemplate('templates/modalTemplate.hbs', '#projects__modals', data);
    }

    // Grab data
    function retriveData() {
        var dataSource = window.location.pathname + 'content.json';
        $.getJSON(dataSource, renderDataVisualsTemplate);
    }

    // Contact form ajax submittion
    function contactFormSubmission() {
        $('#contact__form').submit(function(e) {
            var self = $(this),
                formValid = true;

            e.preventDefault();

            self.find('.form__control').each(function() {
                var elem = $(this);

                elem.removeClass('error');

                if ( elem.val().length == 0 ) {
                    formValid = false;
                    elem.addClass('error');

                    self.find('.button')
                        .addClass('button--error')
                        .html('Proszę wypełnić wszystkie pola<i class="fa fa-pencil right"></i>');
                }
            });

            if (formValid) {
                $.ajax({
                    url: '//formspree.io/kontakt@damian-zawadzinski.pl',
                    method: 'POST',
                    data: $(this).serialize(),
                    dataType: 'json',
                    beforeSend: function() {

                        // Lock all inputs before send
                        self.find('.form__control, textarea').prop('disabled', true);

                        self.find('.button')
                            .prop('disabled', true)
                            .removeClass('button--error')
                            .addClass('button--loading')
                            .html('Wysyłanie wiadomości<i class="fa fa-spinner fa-spin right"></i>');
                    },
                    success: function(data) {

                        self.find('.button')
                            .removeClass('button--loading')
                            .addClass('button--success')
                            .html('Wiadomość została wysłana<i class="fa fa-check right"></i>');

                        self.find('.form__control, textarea')
                            .addClass('success');

                            // After 3 seconds reset for to the initial version
                            window.setTimeout(function() {
                                // Reset form
                                self[0].reset();

                                // Unlock all inputs
                                self.find('.form__control, textarea')
                                    .removeClass('success')
                                    .prop('disabled', false);

                                self.find('.button')
                                    .prop('disabled', false)
                                    .removeClass('button--success')
                                    .html('Wyślij wiadomość<i class="fa fa-angle-right right"></i>');

                            }, 3500);
                    },
                    error: function(err) {

                        self.find('.button')
                            .removeClass('button--loading')
                            .addClass('button--error')
                            .html('Coś poszło nie tak, spróbuj ponownie<i class="fa fa-bug right"></i>');

                        window.setTimeout(function() {
                            // Reset form
                            self[0].reset();

                            // Unlock all inputs
                            self.find('.form__control, textarea').prop('disabled', false);

                            self.find('.button')
                                .prop('disabled', false)
                                .removeClass('button--error')
                                .html('Wyślij wiadomość<i class="fa fa-angle-right right"></i>');

                        }, 3000);

                    }
                });
            }
        });
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
                // Set centered position (e.g. for circle/square buttons)
                x = elem.outerWidth() / -2;
                y = elem.outerHeight() / -2;

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
    function mainNav() {
        $('.menu__item').each(function() {
            var elem        = $(this),
                elemLink    = elem.children('a');

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
                dropdownElem.each(function() {
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
        $(document).on('click', function(e) {
            if ( $('.menu__item').hasClass('expanded') && !$(e.target).is('.menu__item *') ) {
                $('.menu__item').removeClass('expanded');
            }
        });

        function dropShadow() {
            if( $(window).scrollTop() + $('.header__container').height() >= $('#work__section').offset().top ) {
                $('.header__container').addClass('shadow');
            } else {
                $('.header__container').removeClass('shadow');
            }
        }

        // Initialize
        dropShadow();

        // Update on scroll
        $(window).on('scroll', dropShadow);
    }

    // Class toggler for mobile landscape view of main navigation
    function landscapeMenu() {
        var trigger = $('.landscape--trigger'),
            nav = $('.main__navigation');

        trigger.click(function(e) {
            e.preventDefault();
            $('.main__navigation').toggleClass('open');
        });

        $(window).on('resize', function() {
            if( nav.hasClass('open') && !Modernizr.mq(globals.landscape) ) {
                nav.removeClass('open');
            }
        });

        $(window).on('scroll', function() {
            if( nav.hasClass('open') && Modernizr.mq(globals.landscape) ) {
                nav.removeClass('open');
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

            // Unfocus clicked link
            elem.blur();

            // Prevent double click which destroys animate scroll
            if( !elem.data('clicked') ) {
                // trigger animation if window scroll top position isn't equal element offset top
                if( $(window).scrollTop() + headerHeight !== $(target).offset().top) {

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
                }, 1500);
            }

            // Stop the animation if the user scrolls manually (only during the animation)
            body.on('scroll wheel', function() {
                $(this).stop();
                elem.removeData('clicked');
            });
        });
    }

    function backToTop(element) {
        function fadeElem() {
            var screenScroll = $(window).scrollTop(),
                sectionHeight = $('#welcome__section').outerHeight();


            // Toggle class for element if its not mobile device and scroll top of screen is in half of second section.
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
            actualYear = fullDate.getFullYear();

        $(element).text(actualYear);
    }

    function simpleModal() {
        var body = $('body');

        // Click element to trigger modal
        $(document).on('click', '.work__box', function(e) {
            var modalId = $(this).attr('href'),
                close = $(modalId).find('.close__button');

            function closeModal() {
                body.removeClass('overflow-hidden');
                $(modalId).addClass('out').one('animationend webkitAnimationEnd mozAnimationEnd', function() {
                    $(this).removeClass('active out');
                });;
            }

            // Unfocus modal trigger element
            $(this).blur();

            // Close modal
            close.on('click', function(e) {
                closeModal(modalId);
                e.preventDefault();
            });

            // Close modal by pressing ESC key
            $(document).keyup(function(e) {
                if ( e.keyCode == 27 && $(modalId).hasClass('active') ) {
                    closeModal(modalId);
                }
            });

            // Check if target element exists
            if( $(modalId).length ) {
                body.addClass('overflow-hidden');
                $(modalId).addClass('active in').one('animationend webkitAnimationEnd mozAnimationEnd', function() {
                    $(this).removeClass('in');
                });
            }

            e.preventDefault();
        });
    }

    function mobileHorizontalWork() {
        var container = $('#work__section'),
            row = container.find('.row'),
            hint = $('.scroll__reminder');

        function scrollHint() {
            if( row.scrollLeft() > 100 && Modernizr.mq(globals.mobile) ) {
                hint.fadeOut();
            } else {
                hint.fadeIn();
            }
        }

        // Update function o scroll
        row.on('scroll', scrollHint);

        function setProperties() {
            if( Modernizr.mq(globals.mobile) ) {

                hint.fadeIn();
                container.addClass('mobile__view');

            } else {
                hint.fadeOut();
                container.removeClass('mobile__view');
            }
        }

        // Initialize function
        setProperties();

        // Update element on resize
        $(window).on('resize', setProperties);
    }

    // When DOM is ready...
    $(function() {
        retriveData();
        contactFormSubmission();
        clickEffect('.click__effect a, .button', 600, false);
        mainNav();
        landscapeMenu();
        scrollToSection('.scroll--link', 650);
        updateYear('.copyright__year');
        backToTop('.top--scroller');
        simpleModal();
        mobileHorizontalWork();
    });

}(window.jQuery, window, document));
