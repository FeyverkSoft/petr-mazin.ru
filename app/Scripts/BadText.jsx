import React from 'react';
import { Lang } from '../lang.jsx';
import { getObject } from '../Api.jsx';
import { AreaInput, Button, Select } from "../Components/InputAndButton.jsx";

export class BadText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: '',
            result: '',
            textFactor: 10
        };
        this.getRandomInt = this.getRandomInt.bind(this);
        this.getText = this.getText.bind(this);
        this.calc = this.calc.bind(this);
        this.onInputVal = this.onInputVal.bind(this);
    }
    // использование Math.round() даст неравномерное распределение!
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    calc() {
        this.setState({
            result: this.getText(this.state.srcValue, this.state.textFactor)
        });
    }
    onInputVal(val, valid, path) {
        this.setState(getObject(this.state, path, val));
    }
    /**По сути тут и генерируется этот уродливый текст */
    getText(inStr, textFactor) {
        let chars = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a', '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323', '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'];
        let out = "";
        let factor = textFactor || 2;
        if (inStr != null) {
            let arrStr = inStr.split('\n');
            for (let i = 0; i < arrStr.length; i++) {
                for (let j = 0; j < arrStr[i].length; j++) {
                    out += arrStr[i][j];
                    var count = this.getRandomInt(2, textFactor);
                    while (count-- > 0) {
                        out += chars[this.getRandomInt(0, chars.length - 1)];
                    }
                }
                if (arrStr.length != 1 || arrStr.length != i - 1)
                    out += '\r\n';
            }
        }
        return out;
    }
    render() {
        let $this = this;
        return (
            <div className='calc-wrapper'>
                <div className='col-wrapper'>
                    <div className='col-2'>
                        <AreaInput
                            label={Lang('input_text')}
                            onChange={$this.onInputVal}
                            path='srcValue'
                            value={$this.state.srcValue}
                        />
                    </div>
                    <div className='col-2'>
                        <pre className='result-area'>{$this.state.result}</pre>
                    </div>
                </div>
                <div className='col-wrapper'>
                    <div className='col-2 padding-bottom'>
                        <Select
                            items={[5, 10, 20, 40, 50, 100]}
                            value={$this.state.textFactor}
                            onChange={$this.onInputVal}
                            label={Lang('text_factor')}
                            path='textFactor'
                            className='min-screen-100-width'
                        />
                    </div>
                    <div className='col-2 padding-bottom'>
                        <Button
                            onClick={$this.calc}
                            value={Lang('calc')}
                            className='min-screen-100-width' />
                    </div>
                </div>
            </div>);
    }
}