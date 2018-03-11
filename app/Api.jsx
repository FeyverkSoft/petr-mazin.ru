import $ from 'jquery';

Array.prototype.getIndex = function getIndex(func) {
    for (let i = 0; i < this.length; i++) {
        if (func(this[i]))
            return i;
    }
    return -1;
};
Array.prototype.firstOrDefault = function getIndex(func, def) {
    for (let i = 0; i < this.length; i++) {
        if (func(this[i]))
            return this[i];
    }
    return def || undefined;
};

///Рекурсивная ф-я устновки значения поля объекта по указанному пути
export const getObject = function (obj, path, value) {
    let temp = path.match(/[^.]+/g);
    if (!temp)
        return value;
    let prop = temp.reverse().pop();
    let reg = prop.match(/\[(\d)\]/);
    if (reg) {
        let index = reg[1];
        let propWInd = prop.replace(reg[0], '');
        obj[propWInd][index] = getObject(obj[propWInd][index] || {}, temp.join('.'), value);
    } else {
        obj[prop] = getObject(obj[prop] || {}, temp.join('.'), value);
    }
    return obj;
}

export const getGuid = function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

class MainData {
    constructor(DEBUG) {
        this.DEBUG = DEBUG;
    }

    GetAdditionalIcons(onSuccess) {
        if (data && data.main && data.main.additionalIcons) {
            if (this.DEBUG)
                console.log(data.main.additionalIcons);
            onSuccess(data.main.additionalIcons);
            return;
        } else {
            console.info('data is empty')
        }
        onSuccess([]);
    }

}

class Scripts {
    constructor(DEBUG) {
        this.DEBUG = DEBUG;
    }

    GetScripts(query, onSuccess) {
        if (data && data.scripts) {
            let result = data.scripts;
            let page = query.page;
            if (query.search) {
                let search = query.search.trim().toLowerCase();
                if (String.prototype.includes)
                    result = result.filter(
                        x => (x.Title || '').toLowerCase().includes(search) ||
                            (x.Description || '').toLowerCase().includes(search));
                else
                    if (String.prototype.contains)
                        result = result.filter(
                            x => (x.Title || '').toLowerCase().includes(search) ||
                                (x.Description || '').toLowerCase().includes(search));
            }
            if (!query.page)
                page = 1;
            let ret = {
                scripts: result.slice((page - 1) * query.itemPerPage, page * query.itemPerPage),
                totalCount: parseInt(result.length),
                page: parseInt(page)
            };
            if (this.DEBUG) {
                console.log(data.scripts, query.search, query.page, ret);
            }
            onSuccess(ret);
            return;
        } else {
            console.info('scripts data is empty')
        }
        onSuccess({ totalCount: 0, page: 1, scripts: [] });
    }
}

//TODO: Как появится сервер, переписать на ajax
class Api {
    constructor() {
        let DEBUG = true;
        this.MainData = new MainData(DEBUG);
        this.Scripts = new Scripts(DEBUG);
    }
}

export const ApiInstance = new Api;

export const hashVal = function (id) {
    let trimmedId = (id || '').trim().toLowerCase();
    let arr = (window.location.hash || '').replace('#', '').split('&').map(x => {
        if (!x)
            return;
        let temp = x.split('=');
        return { id: temp[0], val: temp[1] };
    });
    if (!arr)
        return undefined;
    let tempVal = (arr.filter(x => x && (x.id || '').toLowerCase() == trimmedId)[0] || {}).val;
    if (tempVal)
        return decodeURI(tempVal);
    return tempVal;
}