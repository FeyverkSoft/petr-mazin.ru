import React from 'react';

export class ColoredCode extends React.Component {
    constructor(props) {
        super(props);
    }

    Syntax(code) {
        var comments = [];	// Тут собираем все комменты
        var strings = [];	// Тут собираем все строки
        var res = [];	// Тут собираем все RegExp
        var all = { 'C': comments, 'S': strings, 'R': res };
        var safe = { '<': '<', '>': '>', '&': '&' };

        return code
            // Маскируем HTML
            .replace(/[<>&]/g, function (m) { return safe[m]; })
            // Убираем комменты
            .replace(/\/\*[\s\S]*\*\//g, function (m) { var l = comments.length; comments.push(m); return '~~~C' + l + '~~~'; })
            .replace(/([^\\])\/\/[^\n]*\n/g, function (m, f) { var l = comments.length; comments.push(m); return f + '~~~C' + l + '~~~'; })
            // Убираем regexp
            .replace(/\/(\\\/|[^\/\n])*\/[gim]{0,3}/g, function (m) { var l = res.length; res.push(m); return '~~~R' + l + '~~~'; })
            // Убираем строки
            .replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, function (m, f, s) { var l = strings.length; strings.push(s); return f + '~~~S' + l + '~~~'; })
            // Выделяем ключевые слова
            .replace(/(var|function|typeof|bool|false|true|let|const\s|get(\s|\{)|set(\s|\{)|class|public|static|int\s|long\s|float\s|double\s|string\s|new|return|if|for|in|while|break|do|continue|switch|case)([^a-z0-9\$_])/gi,
                '<span class="kwrd">$1&nbsp;</span>$2')
            // Выделяем скобки
            .replace(/(\{|\}|\]|\[|\|)/gi,
                '<span class="gly">$1</span>')
            // Выделяем имена функций
            .replace(/(([a-z\_\$][a-z0-9_]*)[\s]*\()|(\=\>)/gi,
                '<span class="func">$2$3</span>(')
            // Возвращаем на место комменты, строки, RegExp
            .replace(/~~~([CSR])(\d+)~~~/g, function (m, t, i) { return '<span class="' + t + '">' + all[t][i] + '</span>'; })
            // Выставляем переводы строк
            .replace(/\n/g,
                '<br/>')
            // Табуляцию заменяем неразрывными пробелами
            .replace(/\t|(\s{2,4})/g,
                '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    render() {
        return (
            <code class={this.props.className}
                dangerouslySetInnerHTML={{ __html: this.Syntax(this.props.children) }}>
            </code>);
    }
}