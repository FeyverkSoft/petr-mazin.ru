/**
 * Алгоритм луна
 */
/// Холст 
import React from 'react';
import { Lang } from '../lang.jsx';
export class Lun extends React.Component {

    //**Базовый алгоритм расчёта контрольного чила луна */
    getLuhn(val) {
        let str = (val || '').replace(/[\s]+/gi, '');
        let sum = 0;

        for (let i = 0; i < value.length; i++) {
            let number = parseInt(value.charAt(i), 10);

            if (i % 2 != 0) {
                number *= 2;
                sum += (number / 10 | 0) + (number % 10);
                continue;
            }
            sum += number;
        }
        for (let i = 0; i < str.length; i++) {
            let num = parseInt(str.charAt(i), 10);
            sum += num;
        }
        return sum;
    }

    render() {
        return (
            <div className="deserted">
                {Lang('deserted')}
            </div>);
    }
}