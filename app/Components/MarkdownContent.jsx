import React from 'react';
export class MarkdownContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: props.value
        }
    }
    render() {
        return (
            <div>{this.state.srcValue}</div>
        );
    }
}