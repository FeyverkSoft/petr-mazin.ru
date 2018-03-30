import React from 'react';
class Token {
    element;
    content;
    onlyText;
    component;
    className;
    constructor(element, content, component, onlyText, className) {
        this.element = element;
        this.component = component || false;
        this.onlyText = onlyText || false;
        this.className = className;
        this.content = content;
    }
    get key() {
        if (this.element == 'br') {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4();
        }
        let _temp = JSON.stringify(this);
        let hash = 0;
        for (var i = 0; i < _temp.length; i++) {
            var character = _temp.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
export class MarkdownContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: props.value,
            dom: this.parse(props.value)
        }
        this.parse = this.parse.bind(this);
        this.renderTree = this.renderTree.bind(this);
    }

    primaryRecognize(src) {
        const header = /^(?![ ]+)([#]{1,6})([ ]{1})/gi;
        const qote = /^(?![ ]+)([>]{1})([ ]{1})/gi;
        const section = /^(?![ ]+)(!===)/gi;
        const code = /^(?![ ]+)(```)/gi;
        const num = /^(?![ ]+)((\*)|(\d\.))([ ]{1})/gi;
        const mark = /^(?![ ]+)(\-)([ ]{1})/gi;
        const subNum = /^([ ]{0,3}((\*)|(\d\.)))([ ]{1})/gi;
        const subMark = /^([ ]{0,3})(\-)([ ]{1})/gi;
        const th = /^(?![ ]+)(\~\|)/gi;
        const tr = /^(?![ ]+)((\|)|(\!\|))/gi;
        const trHidden = /^(?![ ]+)(\!\|)/gi;
        const img = /(?:^(?![ ]+)(?:\!\())(.*?)(?:[)] ?)/i;
        const tdClass = /^(?![ ]+)(\(([\s\w]+)\))\s/i;
        //сложный объект секция, может содержать в нутри себя другие элементы
        //парный объект !===
        if (section.test(src)) {
            let addClass = src.replace(section, '').replace(/ /g, '');
            return new Token('section', undefined, true, false, addClass);
        }

        if (code.test(src)) {
            let addClass = src.replace(code, '').replace(/ /g, '');
            return new Token('code', undefined, true, true, addClass);
        }
        //Блок примитивов
        //заголовки
        if (header.test(src)) {
            let length = src.match(header)[0].length - 1;
            return new Token(`h${length}`, src.replace(header, ''), false, true);
        }
        //цитаты
        if (qote.test(src)) {
            return new Token(`div`, src.replace(qote, ''), false, true, 'quote');
        }
        //нумированный список
        if (subNum.test(src)) {
            return new Token('ol', src.replace(num, ''));
        }
        //маркированный список
        if (subMark.test(src)) {
            return new Token('ul', src.replace(mark, ''));
        }
        //картинки
        if (img.test(src)) {
            return new Token('img', src.match(img)[1]);
        }

        //заголовок таблицы
        if (th.test(src)) {
            let _th = src.replace(th, '').split('|').filter(x => x != '');
            return new Token('thead', _th.map(x => new Token('th', x)));
        };

        //строки таблицы
        if (tr.test(src)) {
            let isHidden = trHidden.test(src);
            let col = src.replace(tr, '').split('|').filter(x => x != '');
            return new Token(isHidden ? 'div' : 'tr',
                col.map(x => {
                    let addClass = ((x || '').match(tdClass) || '')[2];
                    addClass = addClass ? ' ' + addClass : '';
                    return new Token(isHidden ? 'div' : 'td', x.replace(tdClass, ''), false, false, isHidden ? `col-${col.length}${addClass}` : `td${addClass}`);
                }),
                false, false, isHidden ? 'flex-tr' : 'tr')
        }

        if (src == '')
            return new Token('br');

        return new Token('span', src, false, false, 'text');
    }
    //первичный грубый разбор
    primaryParse(src) {
        let arr = (src || '').split('\n');
        let tokens = [];
        let element;

        for (let i = 0; i < arr.length; i++) {
            if (element && element.component) {
                let temp = this.primaryRecognize(arr[i]);
                if ((element.class == temp.class || !temp.class) && element.element == temp.element) {
                    if (element.content && !element.onlyText)
                        element.content = this.primaryParse(element.content);
                    tokens.push(element);
                    element = undefined;
                }
                else
                    element.content = `${(element.content || '')}\n${arr[i]}`;
                continue;
            }
            if (element) {
                tokens.push(element);
                element = undefined;
            }

            element = this.primaryRecognize(arr[i]);
            if (!element.component) {
                tokens.push(element);
                element = undefined;
            }

        }
        return tokens.length == 0 ? src : tokens;
    }

    //обдумать
    secondaryRecognize(src, p) {
        if (!src || src.length <= 1)
            return src;
        let tempTokens = [];
        let content = '';
        for (let i = p || 0; i < src.length; i++) {
            let j = i + 1;
            let br = false;
            let token;

            //перевод на новую строку
            if (`${src[i]}${src[i + 1]}` == '!#' && !br) {
                br = true;
                token = new Token('br');
            }
            if (!br && !/([\~]{2})([\w\W]+)([\~]{2})|([\_])([\w\W]+)([\_])|([\*])([\w\W]+)([\*])|([\*]{2})([\w\W]+)([\*]{2})|([\_]{2})([\w\W]+)([\_]{2})|([\`]{1})([\w\W]+)([\`]{1})|(\!\#)|(\!\([\w\/\.]+\))|(\!\:[\wа-яА-Я\/\.\:]+\:\!)/i.test(src))
                break;
            //блок кода
            if (!br && src[i] == '`') {
                while (j < src.length) {
                    if (src[j++] == '`') {
                        br = true;
                        token = new Token('code', src.substring(i + 1, j - 1), false, true, 'inline-code');
                        break;
                    }
                }
            }
            //жир
            if (!br && ['__', '**'].indexOf(`${src[i]}${src[i + 1]}`) >= 0) {
                while (j < src.length) {
                    j++;
                    if (['__', '**'].indexOf(`${src[j]}${src[j + 1]}`) >= 0) {
                        br = true;
                        token = new Token('b', src.substring(i + 2, j));
                        j++;
                        break;
                    }
                }
            }
            //зачёркнутый
            if (!br && `${src[i]}${src[i + 1]}` == '~~') {
                while (j < src.length) {
                    j++;
                    if (`${src[j]}${src[j + 1]}` == '~~') {
                        br = true;
                        token = new Token('s', src.substring(i + 2, j));
                        break;
                        j++;
                    }
                }
            }
            //курсив
            if (!br && ['_', '*'].indexOf(src[i]) >= 0) {
                while (j < src.length) {
                    j++;
                    if (['__', '**'].indexOf(`${src[j]}${src[j + 1]}`) >= 0)
                        j += 2;
                    if (['_', '*'].indexOf(src[j]) >= 0) {
                        br = true;
                        token = new Token('i', src.substring(i + 1, j));
                        break;
                    }
                }
            }
            //картинка
            if (!br && `${src[i]}${src[i + 1]}` == '!(') {
                while (j < src.length) {
                    j++;
                    if (`${src[j]}` == ')') {
                        br = true;
                        token = new Token('img', src.substring(i + 2, j));
                        break;
                    }
                }
            }
            //ссылка
            if (!br && `${src[i]}${src[i + 1]}` == '!:') {
                while (j < src.length) {
                    j++;
                    if (`${src[j]}${src[j + 1]}` == ':!') {
                        br = true;
                        let linkContent = src.substring(i + 2, j).split(':').filter(x => x != '');
                        if (linkContent.length > 1)
                            token = new Token('a', linkContent[1]);
                        else
                            token = new Token('a', linkContent[0]);
                        token.uri = linkContent[0];
                        break;
                    }
                }
                j++;
            }

            if (br) {
                if (content && content != '') {
                    tempTokens.push(new Token('span', content, false, false, 'text'));
                    content = '';
                }
                if (/([\~]{2})([\w\W]+)([\~]{2})|([\_])([\w\W]+)([\_])|([\*])([\w\W]+)([\*])|([\*]{2})([\w\W]+)([\*]{2})|([\_]{2})([\w\W]+)([\_]{2})|([\`]{2})([\w\W]+)([\`]{2})/i.test(token.content) && !token.onlyText)
                    token.content = this.secondaryRecognize(token.content);
                if (token) {
                    tempTokens.push(token);
                    token = undefined;
                    content = '';
                }
                i = j;
                continue;
            } else
                content += src[i];
        }
        if (content && content != '') {
            tempTokens.push(new Token('span', content, false, false, 'text'));
        }
        if (tempTokens.length == 0)
            return src;
        if (tempTokens.length == 1)
            return tempTokens[0];
        return tempTokens;
    }
    //вторичный и более детальный разбор, + объединение листьев
    secondaryParse(element) {
        if (!element || element.onlyText)
            return element;
        let result = element;
        //console.info(element);

        if (typeof (element) == typeof ('')) {//string
            return this.secondaryRecognize(element);
        }

        if (element instanceof Array) {//array
            for (let i = 0; i < element.length; i++) {
                if (element[i].content)
                    element[i].content = this.secondaryParse(result[i].content);
            }
        }
        if (typeof (element) == typeof ({})) {//object
            if (!element.onlyText && element.content)
                result.content = this.secondaryParse(result.content);
        }
        return result;//заглушка
    }

    normalizeVirtDom(element) {
        if (!element || typeof (element) == typeof ('') || element.onlyText)
            return element;

        if (element instanceof Array) {//array
            let temp = [];
            for (let i = 0; i < element.length; i++) {
                if (element[i].component && !element[i].onlyText) {
                    temp.push(this.normalizeVirtDom(element[i]));
                    continue;
                }
                if (element[i].element == 'ol' || element[i].element == 'ul') {
                    const content = element[i].content;
                    if (temp[temp.length - 1].element == element[i].element) {
                        temp[temp.length - 1].content = ((temp[temp.length - 1].content instanceof Array) ?
                            temp[temp.length - 1].content : [temp[temp.length - 1].content])
                            .concat(new Token('li', content));
                    } else
                        temp.push(new Token(element[i].element, new Token('li', content)));
                    continue;
                }

                if (element[i].element == 'tr' || element[i].element == 'thead') {
                    const thead = [];
                    const tbody = [];
                    const content = [];
                    while (i < element.length && element[i].element == 'thead') {
                        thead.push(new Token('tr', element[i].content));
                        i++;
                    }
                    while (i < element.length && element[i].element == 'tr') {
                        tbody.push(element[i]);
                        i++;
                    }
                    i--;
                    if (thead.length > 0)
                        content.push(new Token('thead', thead.length == 1 ? thead[0] : thead));
                    if (tbody.length > 0)
                        content.push(new Token('tbody', tbody.length == 1 ? tbody[0] : tbody));
                    temp.push(new Token('table', content.length == 1 ? content[0] : content));
                    continue;
                }
                temp.push(element[i]);
            }
            return temp;
        }
        if (typeof (element) == typeof ({})) {//object
            if (!element.onlyText && element.content && element.content instanceof Array)
                element.content = this.normalizeVirtDom(element.content);
        }
        return element;//заглушка
    }

    parse(src) {
        let primaryResult = this.primaryParse(src);
        return this.normalizeVirtDom(this.secondaryParse(primaryResult));
    }

    renderTree(dom) {
        if (dom instanceof Array)
            return dom.map(x => this.renderTree(x));

        if (typeof (dom) == typeof ({})) {//object
            if (!dom.content)
                return <dom.element key={dom.key} className={dom.className} />;

            if (dom.content instanceof Array)
                return <dom.element key={dom.key} className={dom.className}>{dom.content.map(x => this.renderTree(x))}</dom.element>;

            if (typeof (dom.content) === typeof ('')) {
                switch (dom.element) {
                    case 'img':
                        return <img key={dom.key} src={dom.content} className={dom.className} />
                    case 'code':
                        return <code key={dom.key} className={dom.className}><pre>{dom.content}</pre></code>
                    case 'a':
                        return <a key={dom.key} className={dom.className} href={dom.uri}>{dom.content}</a>
                    default:
                        return <dom.element key={dom.key} className={dom.className}>{dom.content || ''}</dom.element>;
                }
            }
            if (typeof (dom) == typeof ({}))
                return <dom.element key={dom.key} className={dom.className}>{this.renderTree(dom.content)}</dom.element>;
        }
        return undefined;
    }

    render() {
        let content;
        if (!this.state.dom)
            content = '';
        if (typeof (this.state.dom) == typeof ('')) {//string
            content = <span className='text'>{this.state.dom}</span>;
        } else {
            content = this.renderTree(this.state.dom) || <pre>{JSON.stringify(this.state.dom, null, "\t")}</pre>;
        }
        return <div className='markdown-wrapper' >{content}</div>;
    }
}