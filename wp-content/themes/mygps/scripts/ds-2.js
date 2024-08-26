'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var throttle = function throttle(func, ms) {
    var isThrottled = false;
    var savedArgs = void 0;
    var savedThis = void 0;

    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};

var resizeComponent = function () {
    var self = {
        screenWidth: window.innerWidth,
        queries: [],
        freezeTime: 200
    };

    /**
     * Заготовка для новых запросов, хранит настройки по умочанию, объединяется с новыми запросами
     * @type {{min: number, max: number, isEnter: boolean, onEnter: null, onEach: null}}
     */
    var defaultQuery = {
        min: 0, max: 10000, isEnter: false, onEnter: null, onFirstEnter: null, onEach: null, onExit: null
    };

    // PRIVATE =========================================================================================================

    /**
     * установка минимального интервала между ресайзами
     * @param {*} time
     */
    var setFreezeTime = function setFreezeTime(time) {
        if (typeof time !== 'number' && typeof time !== 'undefined') {
            console.warn('resizeComponent: freezeTime type must be a number, now a ' + (typeof time === 'undefined' ? 'undefined' : _typeof(time)));
        } else {
            self.freezeTime = time;
        }
    };

    /**
     * проверяем текущий размер экрана
     */
    var checkScreen = function checkScreen() {
        self.screenWidth = window.innerWidth;
    };

    /**
     * выполняем медиа-запрос
     * @param {*} query
     */
    var triggerQuery = function triggerQuery(queryObj) {
        var query = queryObj;
        // проверяем разрешение
        if (query.min <= self.screenWidth && self.screenWidth <= query.max) {
            // onEnter
            if (typeof query.onEnter === 'function' && !query.isEnter) {
                query.onEnter();
                query.isEnter = true;
            }
            // onFirstEnter
            if (typeof query.onFirstEnter === 'function') {
                query.onFirstEnter();
                query.onFirstEnter = function () {};
            }
            // onEach
            if (typeof query.onEach === 'function') {
                query.onEach();
            }
        } else {
            if (query.isEnter) {
                query.onExit();
            }
            query.isEnter = false;
        }
    };

    /**
     * проверяем корректность медиа-запроса
     * @param {*} query
     */
    var validateQuery = function validateQuery(query) {
        var validQuery = query;
        if (typeof validQuery.min !== 'number' && typeof validQuery.min !== 'undefined') {
            console.warn('resizeComponent: query.min type must be a number, now a ' + _typeof(validQuery.min));
            validQuery.min = defaultQuery.min;
        }
        if (typeof validQuery.max !== 'number' && typeof validQuery.max !== 'undefined') {
            console.warn('resizeComponent: query.max type must be a number, now a ' + _typeof(validQuery.min));
            validQuery.max = defaultQuery.max;
        }
        if (typeof validQuery.onEnter !== 'function' && typeof validQuery.onEnter !== 'undefined') {
            console.warn('resizeComponent: query.onEnter type must be a function, now a ' + _typeof(validQuery.onEnter));
            validQuery.onEnter = null;
        }
        if (typeof validQuery.onFirstEnter !== 'function' && typeof validQuery.onFirstEnter !== 'undefined') {
            console.warn('resizeComponent: query.onEnter type must be a function, now a ' + _typeof(validQuery.onFirstEnter));
            validQuery.onFirstEnter = null;
        }
        if (typeof validQuery.onEach !== 'function' && typeof validQuery.onEach !== 'undefined') {
            console.warn('resizeComponent: query.onEach type must be a function, now a ' + _typeof(validQuery.onEach));
            validQuery.onEach = null;
        }
        if (typeof validQuery.onExit !== 'function' && typeof validQuery.onExit !== 'undefined') {
            console.warn('resizeComponent: query.onEach type must be a function, now a ' + _typeof(validQuery.onExit));
            validQuery.onExit = null;
        }
        return validQuery;
    };

    /**
     * добавляем новый медиа-запрос
     * @param {*} query
     */
    var addQuery = function addQuery(query) {
        var newQuery = validateQuery(query);
        self.queries.push(newQuery);
        triggerQuery(newQuery);
    };

    /**
     * перебираем все медиа-запросы при ресайзе, используется декоратор throttle
     */
    var onResize = throttle(function () {
        self.queries.forEach(function (item) {
            triggerQuery(item);
        });
    }, self.freezeTime);

    // INIT ============================================================================================================

    // получаем текущий размер
    checkScreen();
    // навешиваем обработчик
    window.addEventListener('resize', function () {
        checkScreen();
        onResize();
    });

    // PUBLIC ==========================================================================================================
    return Object.freeze({
        /**
         * Установка минимального интервала между ресайзами
         * @param {number} time
         */
        setFreezeTime: setFreezeTime,
        /**
         * Возвращает текущий размер экрана
         * @returns {number}
         */
        getScreenWidth: function getScreenWidth() {
            checkScreen();
            return self.screenWidth;
        },

        /**
         * Добавляет новый медиа-запрос
         * @param {{min: number, max: number, onEnter: function, onEach: function, onExit: function}} query
         */
        addMediaQuery: addQuery,
        /**
         * Принудительно вызывает срабатывание актуальных колбэков
         */
        resizeForce: onResize,
        /**
         * Выводит список текущих медаи-запросов
         */
        debug: function debug() {
            console.log(self.queries);
        }
    });
}();


resizeComponent.addMediaQuery({
    min: 0,    // начало интервала
    max: 767, // конец интервала
    onEnter: function(){
        $('.js-header-logo').append($('.js-header-phone'));
    },
    onExit: function(){
        $('.contacts').append($('.js-header-phone'));
    }
});

const goalsModule = (() => {
    // Enable/Disable tracking services
    const services = {
        yaCounterID: '',
        mailRuID: false,
        ga: true,
        gtag: true,
        fbq: true,
    };

    const goalDone = (goalName, goalCategory) => {
        if (services.yaCounterID !== '' && typeof window[`yaCounter${services.yaCounterID}`] !== 'undefined') {
            window[`yaCounter${services.yaCounterID}`].reachGoal(goalName, () => {});
        }
        if (services.mailRuID !== '' && typeof _tmr !== 'undefined') {
            window._tmr.push({ id: services.mailRuID, type: 'reachGoal', goal: goalName });
        }
        if (services.ga && typeof ga !== 'undefined') {
            window.ga('send', 'event', goalCategory, goalName);
        }
        if (services.gtag && typeof gtag !== 'undefined') {
            window.gtag('event', goalName, { event_category: goalCategory });
        }
        if (services.fbq && typeof fbq !== 'undefined') {
            window.fbq('track', goalName, { });
        }
        console.log(`Goal done. name: ${goalName}, category: ${goalCategory}`);
    };


    const $body = $('body');

    $body.on('click', 'a[href^="tel:"]', () => {
        goalDone('Click on Phone', 'Clicks');
    });

    $body.on('click', 'a[href^="mailto:"]', () => {
        goalDone('Click on Email', 'Clicks');
    });

    // exmaple <a href="https://api.whatsapp.com/send?phone=PHONE_NUMBER">
    $body.on('click', 'a[href^="https://wa.me/"]', () => {
        goalDone('Click on WhatsApp', 'Clicks');
    });

    $body.on('click', 'a[href^="https://apps.apple.com"]', () => {
        goalDone('Click on App Store', 'Clicks');
    });

    $body.on('click', 'a[href^="https://play.google.com"]', () => {
        goalDone('Click on Google Play', 'Clicks');
    });

    return Object.freeze({
        trigger(name, params) {
            goalDone(name, params);
        },
    });
})();
