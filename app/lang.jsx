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
        result: 'Result',
        settings: 'Settings',
        direction_coding: 'Direction',
        decode: 'decode',
        encode: 'encode',
        split: 'Split',
        translit_default: 'Default'
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
        result: 'Результат',
        settings: 'Настройки',
        text_factor_description: 'Настройка агрессивности фильтра',
        direction_coding: 'Направление кодирования/декодирования',
        direction_coding_description: 'Выберите направление преобразования (кодировать/раскодировать)',
        decode: 'раскодировать',
        encode: 'закодировать',
        RFC_3548_description: 'Cимволы \'+\' и \'/\' заменяются, соответственно, на \'-\' и \'_\'',
        split: 'Разрезать',
        split_description: 'Разрезает base64 строку на несколько строк фиксированной ширины',
        split_MaxWidth: 'Задать максимально допустимую длину строки',
        split_MaxWidth_description: 'Укажите максимально допустимую длину строки',
        script_base64: 'BASE64 Decode and Encode',
        translit_gost: 'ГОСТ 7.79-2000',
        translit_uri: 'Translit Uri',
        translit_default: 'По умолчанию',
        translit_type: 'Алгоритм транслитирации',
        translit_type_description: 'Выберете алгоритм транслитирации',
        script_translit: 'Транслит - перевод на латиницу'
    }
}

let _CurrentLang;
export const getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const setCookie = function setCookie(name, val) {
    document.cookie = `${name}=${val}; path=../`;
}
export const CurrentLang = function () {
    return getCookie("Lang") || 'ru';
}
function getTranslate(value) {
    if (!value)
        return value;
    var lang = CurrentLang();
    var locStr = {};
    if (locString[lang])
        locStr = locString[lang];
    else {
        locStr = locString["ru"];
        setCookie("Lang", "ru");
    }

    let lowerVal = value.replace(/ /gi, '').toLowerCase();

    let loc = locStr[value] || locStr[lowerVal];
    if (loc)
        return loc;

    for (let key in locStr) {
        if (key.toLowerCase() == lowerVal)
            return locStr[key];
    }
    return locString["ru"][lowerVal] || locString["ru"][value];
}

export const Lang = function (value, count) {
    let res;
    if (value)
        res = getTranslate(value) || value;
    else
        res = getTranslate(CurrentLang()) || value;

    if (count && res instanceof Array) {
        if (res[count])
            return res[count].replace(/\{\{\0\}\}/ig, count);
        return res[res.length - 1].replace(/\{\{\0\}\}/ig, count);
    }

    return res;
}

