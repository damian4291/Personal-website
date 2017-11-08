const GLOBALS = {
    mobile:     '(max-width: 47.9375em)', /* max 767px */
    landscape:  '(max-width: 47.9375em) and (max-height: 23.4375em)', /* max 767px & 375px */
    tablet:     '(min-width: 48em) and (max-width: 61.9375em)', /*  min 768px & max 991px */
    minTablet:  '(min-width: 48em)', /* min 768px */
    desktop:    '(min-width: 62em)', /* min 992px */
    isWebkit:   'WebkitAppearance' in document.documentElement.style,
    email:      'contact@dzawadzinski.com',
    dataUrl:    '//dzawadzinski.com/content.json'
}

const ajaxRequest = (method, url, callback) => {
    const XHR = new XMLHttpRequest();

    XHR.open(method, url);
    XHR.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            callback(this.response);
        } else {
            new Error(`XHR:: ${this.statusText}`);
        }
    }

    XHR.onerror = (err) => new Error(`XHR:: ${err}`);
    XHR.send();
}

const listenerOnce = (element, event, callback) => {
    element.addEventListener(event, function handler(evt) {
        evt.currentTarget.removeEventListener(evt.type, handler);
        callback();
    });
}

const updateYear = (selector) => {
    const actualYear = new Date().getFullYear();
    document.querySelector(selector).textContent = actualYear;
}

class HandleBarsTemplates {
    constructor(settings = {}) {
        this.settings = settings;
        this.source = settings.dataUrl;
        this.renderDataTemplates(settings.dataUrl);
    }

    renderDataTemplates(data) {
        this.compileTemplate('templates/projectTemplate.hbs', '#projects__items', data, () => new HistoryProjectModal() );
        this.compileTemplate('templates/contactTemplate.hbs', '.info__column', data);
    }

    compileTemplate(withTemplate, inElement, withData, callback) {
        ajaxRequest('GET', withTemplate, (response) => {
            const template = Handlebars.compile(response);
            const templateTarget = document.querySelector(inElement);

            templateTarget.innerHTML = template(withData);
            if (callback && typeof callback === 'function') callback();
        });
    }
}

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact__form');
        this.formActionUrl = `//formspree.io/${GLOBALS.email}`;
        this.formFields = this.form.querySelectorAll('.form__control');
        this.emailField = document.getElementById('emailaddress');
        this.submitButton = this.form.querySelector('.button');
        this.formValid = true;
        this.timeToReset = 3500;

        this.MESSAGES = {
            default: 'Send a message<i class="fa fa-angle-right right"></i>',
            error: 'Something went wrong, try again<i class="fa fa-bug right"></i>',
            required: 'Please fill out all fields<i class="fa fa-pencil right"></i>',
            wrongEmail: 'Please enter correct email address format<i class="fa fa-pencil right"></i>',
            sending: 'Sending message<i class="fa fa-spinner fa-spin right"></i>',
            sent: 'Message has been sent<i class="fa fa-check right"></i>'
        }

        this.formSubmitHandler = this.formSubmitHandler.bind(this);

        this.attachListeners();
    }

    attachListeners() {
        this.form.addEventListener('submit', this.formSubmitHandler);
    }

    formSubmitHandler(evt) {
        evt.preventDefault();
        this.formValid = true;

        this.checkFieldsValidation();
        this.validationFormActions();

        if (this.formValid) this.sendData();
    }

    checkFieldsValidation() {
        for (let i = 0; i < this.formFields.length; i++) {
            this.formFields[i].classList.remove('error');

            if (this.formFields[i].value.length === 0) {
                this.formFields[i].classList.add('error');
                this.formValid = false;
            }
        }
    }

    validationFormActions() {
        if (!this.formValid) {
            document.querySelector('.form__control.error').focus();

            this.submitButton.classList.add('button--error');
            this.submitButton.innerHTML = this.MESSAGES.required;

            window.setTimeout( () => {
                this.submitButton.classList.remove('button--error');
                this.submitButton.innerHTML = this.MESSAGES.default;
            }, this.timeToReset);

        } else {

            if( !this.emailValidation(this.emailField.value) ) {
                this.formValid = false;
                this.emailField.classList.add('error');
                this.emailField.focus();

                this.submitButton.classList.add('button--error');
                this.submitButton.innerHTML = this.MESSAGES.wrongEmail;

                window.setTimeout( () => {
                    this.submitButton.classList.remove('button--error');
                    this.submitButton.innerHTML = this.MESSAGES.default;
                }, this.timeToReset);
            }

        }
    }

    emailValidation(emailAddress) {
        const pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    formObjData(form) {
        let dataObj = {};

        for (let i = 0; i < form.elements.length; i++) {
            if (form.elements[i].value === '') continue;

            switch (form.elements[i].nodeName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'BUTTON':
                    dataObj[form.elements[i].name] = form.elements[i].value
                break;
            }
        }

        return JSON.stringify(dataObj);
    }

    beforeDataSend() {
        for (let i = 0; i < this.formFields.length; i++) {
            this.formFields[i].disabled = true;
        }

        this.submitButton.disabled = true;
        this.submitButton.classList.remove('button--error');
        this.submitButton.classList.add('button--loading');
        this.submitButton.innerHTML = this.MESSAGES.sending;
    }

    successDataSend() {
        this.submitButton.classList.remove('button--loading');
        this.submitButton.classList.add('button--success');
        this.submitButton.innerHTML = this.MESSAGES.sent;

        for (let i = 0; i < this.formFields.length; i++) {
            this.formFields[i].classList.add('success');
        }

        window.setTimeout( () => {
            for (let i = 0; i < this.formFields.length; i++) {
                this.formFields[i].classList.remove('success');
                this.formFields[i].disabled = false;
            }

            this.form.reset();
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('button--success');
            this.submitButton.innerHTML = this.MESSAGES.default;
        }, this.timeToReset);
    }

    errorDataSend() {
        this.submitButton.classList.remove('button--loading');
        this.submitButton.classList.add('button--error');
        this.submitButton.innerHTML = this.MESSAGES.error;

        for (let i = 0; i < this.formFields.length; i++) {
            this.formFields[i].classList.add('error');
        }

        window.setTimeout( () => {
            for (let i = 0; i < this.formFields.length; i++) {
                this.formFields[i].classList.remove('error');
                this.formFields[i].disabled = false;
            }

            this.form.reset();
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('button--error');
            this.submitButton.innerHTML = this.MESSAGES.default;
        }, this.timeToReset);
    }

    sendData() {
        this.beforeDataSend();
        const data = this.formObjData(this.form);
        const XHR = new XMLHttpRequest();

        XHR.open('POST', this.formActionUrl);
        XHR.setRequestHeader('Accept', 'application/json; charset=utf-8');
        XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        XHR.onloadend = (response) => {
            if (response.target.status >= 200 && response.target.status < 400) {
                this.successDataSend();
            } else {
                this.errorDataSend();
            }
        }

        XHR.send(data);
    }
}

class MainNavigation {
    constructor() {
        this.header = document.querySelector('.header__container');
        this.navigation = document.querySelector('.main__navigation');
        this.navItems = document.querySelectorAll('.menu__item');
        this.landscapeTrigger = document.querySelector('.landscape--trigger');

        this.dropShadowHandler = this.dropShadowHandler.bind(this);
        this.triggerHandler = this.triggerHandler.bind(this);
        this.outsideClickHandler = this.outsideClickHandler.bind(this);

        this.addDropDownAnchor();
        this.dropShadowHandler();
        this.attachListeners();
    }

    attachListeners() {
        this.landscapeTrigger.addEventListener('click', this.triggerHandler);

        document.addEventListener('scroll', () => {
            this.dropShadowHandler();

            if ( this.navigation.classList.contains('open') && Modernizr.mq(GLOBALS.landscape) ) {
                this.navigation.classList.remove('open');
            }
        });

        window.addEventListener('resize', () => {
            if ( this.navigation.classList.contains('open') && !Modernizr.mq(GLOBALS.landscape) ) {
                this.navigation.classList.remove('open');
            }
        });
    }

    menuListToggleVisibility(trigger, element, listElemClass, multiple = false) {
        trigger.addEventListener('click', (evt) => {
            evt.preventDefault();

            if ( element.classList.contains('expanded') ) {
                trigger.setAttribute('aria-expanded', true)
            } else {
                trigger.setAttribute('aria-expanded', false)
            }

            if (!multiple) {
                let listElems = documents.querySelectorAll(listElemClass);

                for (let i; i < listElems.length; i++) {
                    listElems[i].classList.remove('expanded');
                }

            } else {
                element.classList.toggle('expanded');
            }
        });
    }

    addDropDownAnchor() {
        for (let i = 0; i < this.navItems.length; i++) {
            const navItem = this.navItems[i];
            const navItemLink = navItem.getElementsByTagName('a')[0];

            if (navItem.querySelector('.dropdown__menu') != null) {
                navItemLink.appendChild('<i class="fa fa-chevron-right dropdown--icon right small"></i>');
                navItemLink.setAttribute('role', 'button');
                navItemLink.setAttribute('aria-haspopup', true);
                navItemLink.setAttribute('aria-expanded', false);

                menuListToggleVisibility(navItemLink, navItem, '.menu__item', false);

                const dropdownList = navItem.querySelector('.dropdown__menu');
                const subNavItems = dropdownList.querySelectorAll('.sub--menu__item');

                for (let i = 0; i < subNavItems.length; i++) {
                    const subNavItem = subNavItems[i];
                    const subNavLink = subNavItem.getElementsByTagName('a')[0];

                    if (subNavItem.querySelector('.sub--dropdown__menu') != null) {
                        subNavLink.appendChild('<i class="fa fa-chevron-right dropdown--icon right small"></i>');
                        toggleElem(subNavLink, subNavItem, '.sub--menu__item', true);
                    }
                }
            }
        }
    }

    dropShadowHandler() {
        const workSection = document.querySelector('#work__section');

        if (window.scrollY + this.header.offsetHeight > workSection.offsetTop) {
            this.header.classList.add('shadow');
        } else {
            this.header.classList.remove('shadow');
        }
    }

    triggerHandler(evt) {
        evt.preventDefault();
        this.navigation.classList.toggle('open');
    }

    outsideClickHandler(evt) {
        const navItem = document.querySelector(this.navItemClass);
        const isActive = document.querySelector(`${this.navItemClass}.expanded`).length != null;

        if ( isActive && e.target != document.querySelector(`${this.navItemClass} *`) ) {
            navItem.classList.remove('expanded');
        }
    }
}

class ScrollToSection {
    constructor(settings = {}) {
        this.settings = settings;
        this.clickTargets = document.querySelectorAll(settings.element);
        this.delay = settings.delay;
        this.handleClick = this.handleClick.bind(this);

        this.attachListeners();
    }

    attachListeners() {
        for (let i = 0; i < this.clickTargets.length; i++) {
            this.clickTargets[i].addEventListener('click', this.handleClick);
        }
    }

    animateScrollAction(destination) {
        const start = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        const headerHeight = document.querySelector('.header__container').offsetHeight;
        const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        const destinationOffset = document.querySelector(destination).offsetTop - headerHeight;
        const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

        const animateScrollAction = () => {
            const now = 'now' in window.performance ? performance.now() : new Date().getTime();
            const time = Math.min(1, ((now - startTime) / this.delay));
            const timeFunction = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;

            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

            if (window.pageYOffset === destinationOffsetToScroll || window.pageYOffset === 0) return;

            requestAnimationFrame(animateScrollAction);
        }

        animateScrollAction();
    }

    handleClick(evt) {
        evt.preventDefault();
        const target = (evt.target.href == undefined) ? evt.target.parentNode : evt.target;

        target.blur();
        this.animateScrollAction( target.getAttribute('href') );
    }
}

class BackToTop {
    constructor(elementClass = '.top--scroller') {
        this.scrollButton = document.querySelector(elementClass);
        this.welcomeSection = document.getElementById('welcome__section');

        this.actionHandler = this.actionHandler.bind(this);

        this.actionHandler();
        this.attachListeners();
    }

    attachListeners() {
        document.addEventListener('scroll', this.actionHandler);
        document.addEventListener('resize', this.actionHandler);
    }

    actionHandler() {
        const sectionHeight = this.welcomeSection.offsetHeight;

        if ( Modernizr.mq(GLOBALS.desktop) &&  window.scrollY >= sectionHeight / 2) {
            this.scrollButton.classList.add('visible');
        } else if ( this.scrollButton.classList.contains('visible') ) {
            this.scrollButton.classList.remove('visible');
        }
    }
}

class HistoryProjectModal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.heading = this.modal.querySelector('.modal__title');
        this.liveLink = this.modal.querySelector('.see__live');
        this.image = this.modal.querySelector('.modal__image');
        this.content = this.modal.querySelector('.modal__content');
        this.closeButton = this.modal.querySelector('.close__button');

        this.workSection = document.getElementById('work__section');
        this.workBoxes = this.workSection.querySelectorAll('.work__box');

        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.projectClickHandler = this.projectClickHandler.bind(this);
        this.closeClickHandler = this.closeClickHandler.bind(this);
        this.closeKeyPressHandler = this.closeKeyPressHandler.bind(this);
        this.modalActionsIn = this.modalActionsIn.bind(this);
        this.modalActionsOut = this.modalActionsOut.bind(this);

        this.attachListeners();
        this.initCheck();
    }

    attachListeners() {
        this.closeButton.addEventListener('click', this.closeClickHandler);
        window.addEventListener('popstate', this.stateChangeHandler);

        for (var i = 0; i < this.workBoxes.length; i++) {
            this.workBoxes[i].addEventListener('click', this.projectClickHandler);
        }
    }

    initCheck() {
        const modalId = window.location.hash.slice(1);
        const selectorTarget = `.work__box[data-id="${modalId}"]`;

        if (window.location.hash.length !== 0 && this.workSection.querySelector(selectorTarget) !== null) {
            this.workSection.querySelector(selectorTarget).click();
        }
    }

    projectClickHandler(evt, elem) {
        evt.preventDefault();

        const target = (evt.target.tagName !== 'A') ? evt.target.parentNode : evt.target;
        const modalId = target.getAttribute('data-id');
        const projectObj = JSON.parse( localStorage.getItem('webContent') );
        const modalData = projectObj.projects[modalId].modal;

        history.pushState(modalData, null, target.href);
        this.fillModalTemplate(modalId, modalData);

        document.body.classList.add('overflow-hidden');
        this.modal.classList.add('active');
        this.modal.classList.add('in');

        listenerOnce(this.modal, 'animationend', this.modalActionsIn);
        document.addEventListener('keyup', this.closeKeyPressHandler);
    }

    closeKeyPressHandler(evt) {
        if ( evt.keyCode == 27 && this.modal.classList.contains('active') ) {
            this.closeClickHandler(evt);
        }
    }

    closeClickHandler(evt) {
        evt.preventDefault();

        document.body.classList.remove('overflow-hidden');
        this.modal.classList.add('out');

        history.pushState(null, null, window.location.origin);

        listenerOnce(this.modal, 'animationend', this.modalActionsOut);
        document.removeEventListener('keyup', this.closeKeyPressHandler);
    }

    modalActionsIn() {
        this.modal.classList.remove('in');
    }

    modalActionsOut() {
        this.modal.classList.remove('active');
        this.modal.classList.remove('out');
    }

    stateChangeHandler(evt) {
        if (evt.state !== null) {
            const modalId = window.location.hash.slice(1);
            this.fillModalTemplate(modalId, evt.state);

            document.body.classList.add('overflow-hidden');
            this.modal.classList.add('active');
            this.modal.classList.add('in');

            listenerOnce(this.modal, 'animationend', () => this.modalActionsIn() );
        } else {

            if ( this.modal.classList.contains('active') ) this.closeButton.click();
        }
    }

    fillModalTemplate(id, data) {
        if ( id === this.modal.getAttribute('data-id') ) return;

        const imgUrl = (GLOBALS.desktop) ? data.imgUrl : data.mobileimgUrl;

        this.heading.textContent = data.title;
        this.content.innerHTML = data.content;
        this.modal.setAttribute('data-id', id);

        this.imageSpinner(this.image, 'beforebegin');

        this.image.src = imgUrl;
        this.image.alt = data.imgAlt;
        this.image.classList.remove('loaded');

        this.image.onload = () => {
            let spinner = this.modal.querySelector('.spinner');
            spinner.parentNode.removeChild(spinner);
            this.image.classList.add('loaded');
        };

        if (data.liveUrl === undefined) {
            this.heading.classList.remove('has-live');
            this.liveLink.style.display = 'none';
        } else {
            this.heading.classList.add('has-live');
            this.liveLink.removeAttribute('style');
            this.liveLink.href = data.liveUrl;
        }
    }

    imageSpinner(target, position) {
        const spinner = `
            <div class="spinner white">
                <div class="spinner__inner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        `;

        if (target !== undefined)
            target.insertAdjacentHTML(position, spinner);
    }
}

class MobileHorizontalWork {
    constructor() {
        this.workSection = document.getElementById('work__section');
        this.sectionRow = document.getElementById('projects__items');
        this.hintLabel = this.workSection.querySelector('.scroll__reminder');

        this.scrollHintHandler = this.scrollHintHandler.bind(this);
        this.setPropertiesHandler = this.setPropertiesHandler.bind(this);

        this.setPropertiesHandler();
        this.attachListeners();
    }

    attachListeners() {
        this.sectionRow.addEventListener('scroll', this.scrollHintHandler);
        window.addEventListener('resize', this.setPropertiesHandler);
    }

    scrollHintHandler() {
        if( this.sectionRow.scrollLeft > 100 && Modernizr.mq(GLOBALS.mobile) ) {
            this.hintLabel.classList.add('hidden');
        } else {
            this.hintLabel.classList.remove('hidden');
        }
    }

    setPropertiesHandler() {
        if (Modernizr.mq(GLOBALS.mobile)) {
            this.workSection.classList.add('mobile__view');
            this.hintLabel.classList.remove('hidden');
        } else {
            this.workSection.classList.remove('mobile__view');
            this.hintLabel.classList.add('hidden');
        }
    }
}

new ContactForm();
new MainNavigation();
new MobileHorizontalWork();
new BackToTop();
new ScrollToSection({ element: '.scroll__link', delay: 500 });

updateYear('.copyright__year');

ajaxRequest('GET', GLOBALS.dataUrl, (dataResponse) => {
    new HandleBarsTemplates({ dataUrl: JSON.parse(dataResponse) });
    const getLocalData = localStorage.getItem('webContent');

    if (!getLocalData || (dataResponse !== getLocalData) ) {
        localStorage.setItem('webContent', dataResponse);
    }
});
