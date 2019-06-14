/**
 * Мок апи, пока что так, так как хостинг самый дешманский
 */

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

//что-то кроссбраузерное
export const contains = function (str, search, ignoreCase) {
    let _str;
    let _search;
    if (ignoreCase) {
        _str = (str || '').toLowerCase();
        _search = (search || '').toLowerCase();
    } else {
        _str = (str || '');
        _search = (search || '');
    }
    if (String.prototype.includes)
        return _str.includes(_search);
    if (String.prototype.contains)
        return _str.contains(_search);
    if (String.prototype.indexOf)
        return _str.indexOf(_search) >= 0;
    return false;
}

export const getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
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

    normalize(scr) {
        return scr.map(x => {
            return {
                Id: x.Name,
                Title: x.Title,
                Description: x.Description,
                Date: x.Date,
                Cover: x.Cover,
                Markdown: x.Markdown
            }
        });
    }

    GetScripts(query, onSuccess) {
        if (data && data.scripts) {
            let result = this.normalize(data.scripts);
            let page = query.page;
            if (query.search) {
                let search = query.search.trim().toLowerCase();
                result = result.filter(
                    x => contains(x.Title, search, true) || contains(x.Description, search, true));
            }
            if (!query.page)
                page = 1;
            let ret = {
                items: result.slice((page - 1) * query.itemPerPage, page * query.itemPerPage),
                totalCount: parseInt(result.length),
                page: parseInt(page)
            };
            if (this.DEBUG) {
                console.log(result, query.search, query.page, ret);
            }
            onSuccess(ret);
            return;
        } else {
            console.info('scripts data is empty')
        }
        onSuccess({ totalCount: 0, page: 1, scripts: [] });
    }
    GetMarkdown(query, onSuccess) {
        if (data && data.scripts) {
            let id = ((query || {}).id || '');
            let scr = this.normalize(data.scripts).filter(x => (x.Id || '').toLowerCase() == id.toLowerCase())[0];
            onSuccess({ Markdown: (scr || {}).Markdown || '' });
            return;
        }
        onSuccess({ Markdown: '' });
    }
}

class News {
    constructor(DEBUG) {
        this.DEBUG = DEBUG;
    }
    normalize(scr) {
        return scr.map(x => {
            return {
                Id: x.Id,
                Title: x.Title,
                Description: x.Description,
                Date: x.DateTime,
                Cover: x.Cover,
                Markdown: x.Markdown
            }
        }).sort((x, y) => { return y.Id - x.Id });
    }

    GetNews(query, onSuccess) {
        if (data && data.news) {
            let result = this.normalize(data.news);
            let page = query.page;
            if (query.search) {
                let search = query.search.trim().toLowerCase();
                result = result.filter(
                    x => contains(x.Title, search, true) || contains(x.Description, search, true)
                        || contains(x.Markdown.substring(0, 1500), search, true));
            }
            if (!query.page)
                page = 1;
            let ret = {
                items: result.slice((page - 1) * query.itemPerPage, page * query.itemPerPage),
                totalCount: parseInt(result.length),
                page: parseInt(page)
            };
            if (this.DEBUG) {
                console.log(result, query.search, query.page, ret);
            }
            onSuccess(ret);
            return;
        } else {
            console.info('news data is empty')
        }
        onSuccess({ totalCount: 0, page: 1, news: [] });
    }
    GetMarkdown(query, onSuccess) {
        if (data && data.news) {
            let id = ((query || {}).id || '');
            let scr = this.normalize(data.news).filter(x => (x.Id || '').toLowerCase() == id.toLowerCase())[0];
            onSuccess({ Markdown: (scr || {}).Markdown || '' });
            return;
        }
        onSuccess({ Markdown: '' });
    }
}
//TODO: Как появится сервер, переписать на ajax
class Api {
    constructor() {
        let DEBUG = true;
        this.MainData = new MainData(DEBUG);
        this.Scripts = new Scripts(DEBUG);
        this.News = new News(DEBUG);
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