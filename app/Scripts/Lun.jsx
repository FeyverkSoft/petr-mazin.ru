/**
 * Алгоритм луна
 */
/// Холст 
import React from 'react';
import { Lang } from '../lang.jsx';
import { getObject } from '../Api.jsx';
import { Input, LabeledContent } from "../Components/InputAndButton.jsx";
export class Lun extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            luhn: {
                isValid: true,
                nextDidit: undefined
            }
        }
        this.onInputVal = this.onInputVal.bind(this);
        this.getLuhn = this.getLuhn.bind(this);
    }
    //**Базовый алгоритм расчёта контрольного чила луна */
    getLuhn(val) {
        let str = (val || '').replace(/[\s]+/gi, '');
        let sum = 0;
        var flag = str.length % 2 != 0;
        for (let i = 0; i < str.length; i++) {
            let number = parseInt(str[i]);

            if (i % 2 == flag) {
                number *= 2;
                number -= number > 9 ? 9 : 0;
                sum += number;
                continue;
            }
            sum += number;
        }
        return sum;
    }
    onInputVal(val, valid) {
        let luhn = {
            isValid: false,
            nextDidit: ''
        };
        if (val != this.state.value && valid) {
            let next = this.getLuhn(`${val}0`);
            let nextDigit = (next % 10 == 0) ? 0 : 10 - next % 10;
            luhn.isValid = this.getLuhn(val) % 10 == 0;
            luhn.nextDidit = nextDigit;
        }
        this.setState({
            value: val,
            luhn: luhn
        });
    }
    render() {
        let $this = this;
        return (
            <div className='calc-wrapper'>
                <Input
                    label={'input_number'}
                    onChange={$this.onInputVal}
                    regEx='[\d ]+'
                    value={this.state.value}
                    regExMessage='invalid format'
                />
                <div className='col-wrapper'>
                    <LabeledContent
                        className='col-2'
                        label={'result_of_checking'}>
                        {$this.state.luhn.isValid ? 'valid' : 'invalid'}
                    </LabeledContent>
                    <LabeledContent
                        className='col-2'
                        label={'next_digit'}>
                        {$this.state.luhn.nextDidit}
                    </LabeledContent>
                </div>
            </div>
        );
    }
}