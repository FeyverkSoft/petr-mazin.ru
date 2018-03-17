import React from 'react';
import { ApiInstance, getGuid } from "../Api.jsx";
import { Lang } from '../lang.jsx';

///Текстовое поле поиска в материл дезайн стиле
export class OmniTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IsHide: this.props.isHide || ((this.props.value || '') == ''),
            value: this.props.value || '',
            typingTimeOut: 0
        };
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentWillReceiveProps(props) {
        if (this.state.value != (props.value || '')) {
            this.setState({ value: props.value || '' });
        }
    }
    hide() {
        if (!this.state.IsHide) {
            this.setState({ IsHide: true });
            this.pagesearchfield.blur();
        }
    }

    show() {
        if (this.state.IsHide) {
            this.setState({ IsHide: false });
            this.pagesearchfield.focus();
        }
    }

    onChange(event) {
        let $this = this;
        if (this.props.onChange) {
            if ($this.state.typingTimeout) {
                clearTimeout($this.state.typingTimeout);
            }

            $this.setState({
                value: event.target.value,
                typingTimeout: setTimeout(function () {
                    $this.props.onChange($this.state.value);
                }, 500)
            });
        }
    }

    render() {
        let $this = this;
        return (
            <div className="omni-field">
                <span className="open-icon material-icon"
                    onClick={$this.show}>
                    {$this.props.icons}
                </span>
                <div className={`input-field-wrapper ${$this.state.IsHide ? 'hide-field' : ''}`}>
                    <input className="input-field"
                        ref={(input) => { this.pagesearchfield = input; }}
                        placeholder={$this.props.placeHolder}
                        onChange={$this.onChange}
                        value={$this.state.value}
                        autoFocus={!$this.state.IsHide}
                    />
                    <span className="bar main-bar" />
                    <span className={`close-icon material-icon ${$this.state.IsHide ? 'hide' : ''}`}
                        onClick={$this.hide}>
                        close
                    </span>
                </div>
            </div>);
    }
}
