import React from 'react';
export class MarkdownContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: props.value,
            dom: this.parse(props.value)
        }
        this.parse = this.parse.bind(this);
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
            return {
                element: 'section',
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
                content: src.replace(num, ''),
                sub: !num.test(src),
            };
        }
        //маркированный список
        if (subMark.test(src)) {
            return {
                element: 'ul',
                content: src.replace(mark, ''),
                sub: !mark.test(src),
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
            //блок кода
            if (src[i] == '`') {
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
            //перевод на новую строку
            if (`${src[i]}${src[i + 1]}` == '!#') {
                br = true;
                token = { element: 'br' };
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
                if (token) {
                    tempTokens.push(token);
                    token = undefined;
                }
                i = j;
                continue;
            }
            content += src[i];
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

    parse(src) {
        let primaryResult = this.primaryParse(src);
        return this.secondaryParse(primaryResult);
    }

    render() {
        return (
            <pre>{JSON.stringify(this.state.dom, null, "\t")}</pre>
        );
    }
}