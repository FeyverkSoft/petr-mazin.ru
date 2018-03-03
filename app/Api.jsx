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

class Api {
    constructor() {
        let DEBUG = true;
        this.MainData = new MainData(DEBUG);
    }
}

export const ApiInstance = new Api;