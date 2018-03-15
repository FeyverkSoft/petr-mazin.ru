import React from 'react';
import { Lang } from '../lang.jsx';
export class BadText extends React.Component {
    render() {
        return (
            <div className="deserted">
                {Lang('deserted')}
            </div>);
    }
}