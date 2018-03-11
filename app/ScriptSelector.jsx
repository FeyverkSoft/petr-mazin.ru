import React from 'react';

export class ScriptSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id
        }
    }
    render() {
        return (
            <div>{this.state.id}</div>
        );
    }
}