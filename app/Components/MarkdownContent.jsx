import React from 'react';
export class MarkdownContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: props.value,
            dom: this.parse(props.value)
        }
        this.parse = this.parse.bind(this);
        this.buildDom = this.buildDom.bind(this);
    }

    primaryRecognize(src) {
        const header = /^(?![ ]+)([#]{1,6})([ ]{1})/gi;
        const qote = /^(?![ ]+)([>]{1})([ ]{1})/gi;
        const section = /^(?![ ]+)(!===)/gi;
        const code = /^(?![ ]+)(```)/gi;
        const num = /^(?![ ]+)((\*)|(\d\.))([ ]{1})/gi;
        const mark = /^(?![ ]+)(\-)([ ]{1})/gi;
        const subNum = /([ ]{0,3})((\*)|(\d\.))([ ]{1})/gi;
        const subMark = /([ ]{0,3})(\-)([ ]{1})/gi;
        const th = /^(?![ ]+)(\~\|)/gi;
        const tr = /^(?![ ]+)((\|)|(\!\|))/gi;
        const trHidden = /^(?![ ]+)(\!\|)/gi;
        const img = /(?:^(?![ ]+)(?:\!\())(.*?)(?:[)] ?)/i;
        //сложный объект секция, может содержать в нутри себя другие элементы
        //парный объект !===
        if (section.test(src)) {
            let addClass = src.replace(section, '').replace(/ /g, '');
            return {
                element: 'section',
                class: addClass,
                component: true
            };
        }

        if (code.test(src)) {
            let addClass = src.replace(code, '').replace(/ /g, '');
            return {
                element: 'code',
                class: addClass,
                component: true,
                onlyText: true
            };
        }
        //Блок примитивов
        //заголовки
        if (header.test(src)) {
            let length = src.match(header)[0].length - 1;
            return {
                element: `h${length}`,
                content: src.replace(header, ''),
                onlyText: true
            };
        }
        //цитаты
        if (qote.test(src)) {
            return {
                element: 'div',
                class: `quote`,
                content: src.replace(qote, ''),
                onlyText: true
            };
        }
        //нумированный список
        if (subNum.test(src)) {
            return {
                element: 'ol',
                content: src.replace(num, '')//,
                //sub: !num.test(src),
            };
        }
        //маркированный список
        if (subMark.test(src)) {
            return {
                element: 'ul',
                content: src.replace(mark, '')//,
                //sub: !mark.test(src),
            };
        }
        //картинки
        if (img.test(src)) {
            return {
                element: 'img',
                component: false,
                content: src.match(img)[1]
            }
        }

        //заголовок таблицы
        if (th.test(src)) {
            return {
                element: 'th',
                component: false,
                content: src.replace(th, '').split('|').filter(x => x != '')
            }
        };

        //строки таблицы
        if (tr.test(src)) {
            let isHidden = trHidden.test(src);
            let col = src.replace(tr, '').split('|').filter(x => x != '');
            return {
                element: isHidden ? 'div' : 'tr',
                class: isHidden ? 'flex-tr' : 'tr',
                component: false,
                content: col.map(x => {
                    return {
                        element: isHidden ? 'div' : 'td',
                        class: isHidden ? `col-${col.length}` : 'td',
                        content: x
                    }
                })
            };
        }

        if (src == '')
            return {
                element: 'br'
            };
        return {
            element: 'span',
            class: `text`,
            content: src
        };
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
        const leter = ['`', '_', '*', '~'];
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
                token = { element: 'br' };
            }
            if (!br && !/([\~]{2})([\w\W]+)([\~]{2})|([\_])([\w\W]+)([\_])|([\*])([\w\W]+)([\*])|([\*]{2})([\w\W]+)([\*]{2})|([\_]{2})([\w\W]+)([\_]{2})|([\`]{1})([\w\W]+)([\`]{1})|(\!\#)|(\!\([\w\/\.]+\))/i.test(src))
                break;
            //блок кода
            if (!br && src[i] == '`') {
                while (j < src.length) {
                    if (src[j++] == '`') {
                        br = true;
                        token = {
                            element: 'code',
                            class: 'inline-code',
                            onlyText: true,
                            content: src.substring(i + 1, j - 1)
                        };
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
                        token = {
                            element: 'b',
                            content: src.substring(i + 2, j)
                        };
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
                        token = {
                            element: 's',
                            content: src.substring(i + 2, j)
                        };
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
                        token = {
                            element: 'i',
                            content: src.substring(i + 1, j)
                        };
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
                        token = {
                            element: 'img',
                            content: src.substring(i + 2, j)
                        };
                        break;
                    }
                }
            }

            if (br) {
                if (content && content != '') {
                    tempTokens.push({
                        element: 'span',
                        class: `text`,
                        content: content
                    });
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
            tempTokens.push({
                element: 'span',
                class: `text`,
                content: content
            });
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
                    temp.push(this.normalizeVirtDom(element[i].content));
                    continue;
                }
                if (element[i].element == 'ol' || element[i].element == 'ul') {
                    const content = element[i].content;
                    if (temp[temp.length - 1].element == element[i].element) {
                        temp[temp.length - 1].content = ((temp[temp.length - 1].content instanceof Array) ?
                            temp[temp.length - 1].content : [temp[temp.length - 1].content]).concat({
                                element: 'li',
                                content: content
                            });
                    } else
                        temp.push({
                            element: element[i].element,
                            content: {
                                element: 'li',
                                content: content
                            }
                        });
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

    buildDom(dom) {
        let $this = this;
        let result;
        if (dom instanceof Array) {//array
            let list;
            for (let i = 0; i < dom.length; i++) {
                if (dom[i].element == 'ol' || dom[i].element == 'ul') {
                    if (!list)
                        list = <ol></ol>;
                    if (!list.props.children)
                        list.props.children = [];
                    list.props.children.push(<li>{dom[i].content}</li>);
                }
            }
            result = list;
        }
    }
    render() {
        if (!this.state.dom)
            return <div className='markdown' />;
        if (typeof (this.state.dom) == typeof ('')) {//string
            return <span>{this.state.dom}</span>;
        }
        //return this.buildDom(this.state.dom);
        return (
            <pre>{JSON.stringify(this.state.dom, null, "\t")}</pre>
        );
    }
}