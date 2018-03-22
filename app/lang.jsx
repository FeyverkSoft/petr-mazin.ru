const locString = {
    en: {
        menu_home: "Home",
        menu_scripts: "Scripts",
        menu_about: "About",
        homepage_title: "Homepage",
        about_title: "About me",
        search: "Search",
        scripts_title: "Scripts",
        scripts_sub_title: "Scripts list",
        deserted: 'This place is utterly, totally deserted...',
        home_page_sub_title: 'Notes & news',
        script_lun: 'Calculator Luhn algorithm',
        more_info: 'more...',
        page_not_found_title: 'Page not found',
        input_number: 'Input number',
        result_of_checking: 'Result of checking:',
        next_digit: 'Next digit:',
        calc: 'calculate',
        input_text: 'Input text',
        text_factor: 'Aggressiveness filter',
        result: 'Result'
    },
    ru: {
        menu_home: "Домой",
        menu_scripts: "Скрипты",
        menu_about: "О",
        homepage_title: "Домашняя страница",
        about_title: "Обо мне",
        search: "Искать",
        scripts_title: "Скрипты",
        scripts_sub_title: "Список некоторых скриптов, которыми я иногда пользуюсь",
        deserted: 'Это место абсолютно пустынно...',
        home_page_sub_title: 'Заметки и новости',
        more_info: 'подробнее...',
        ru: "Русский",
        en: "English",
        script_lun: 'Калькулятор алгоритма Луна',
        script_badtext: 'Генерация странного текста',
        page_not_found_title: 'Страница не найдена',
        page_not_found: 'Опачки! Сорян, бро... Страница не найдена...',
        input_number: 'Введите число',
        result_of_checking: 'Результат проверки:',
        next_digit: 'Следующая цифра:',
        calc: 'Рассчитать',
        input_text: 'Введите текст',
        text_factor: 'Агрессивность фильтра',
        result: 'Результат'
    }
}
export const getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
}

export const setCookie = function setCookie(name, val) {
    document.cookie = name + "=" + val;
}
export const CurrentLang = function () {
    return getCookie("Lang") || 'ru';
}
function getTranslate(value) {
    var lang = CurrentLang();
    var locStr = {};
    if (locString[lang])
        locStr = locString[lang];
    else {
        locStr = locString["ru"];
        setCookie("Lang", "ru");
    }
    return locStr[value] || locString["ru"][value];
}

export const Lang = function (value) {
    if (value)
        return getTranslate(value) || value;
    else
        return getTranslate(CurrentLang()) || value;
}

