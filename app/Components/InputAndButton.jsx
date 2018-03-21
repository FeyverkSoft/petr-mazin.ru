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

//кнопка ссылка.
export class LinkButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }
    render() {
        let disabled = this.props.disabled ? ' disabled' : '';
        return (
            <div className={`link-button${disabled}`}
                onClick={this.onClick}>
                {this.props.value || this.props.children}
            </div>
        );
    }
}

//кнопка.
export class Button extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }
    render() {
        let disabled = this.props.disabled ? ' disabled' : '';
        return (
            <div className={`button${disabled}`}
                onClick={this.onClick}>
                {this.props.value || this.props.children}
            </div>
        );
    }
}

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            typingTimeOut: 0,
            timeout: this.props.timeout || 500,
            valid: true
        };
        this.onChange = this.onChange.bind(this);
        this.validate = this.validate.bind(this);
    }
    componentWillMount() {
        this.setState({ valid: this.validate() });
    }

    componentWillReceiveProps(props) {
        if (this.state.value != (props.value || '')) {
            this.setState({
                value: props.value || '',
                valid: this.validate(props.value)
            });
        }
    }

    onChange(event) {
        let $this = this;
        let val = event.target.value;
        let valid = $this.validate(val);

        if ($this.state.typingTimeout) {
            clearTimeout($this.state.typingTimeout);
        }

        $this.setState({
            value: val,
            typingTimeout: setTimeout(function () {
                if ($this.props.onChange) {
                    $this.props.onChange(val, valid);
                }
            }, $this.state.timeout),
            valid: valid
        });
    }

    validate(value) {
        let $this = this;
        let val = (value || ($this.state || {}).value);
        let valid = true;
        if ($this.props.IsRequired && !val)
            valid &= false;
        if ($this.props.regEx && val) {
            let reg = new RegExp($this.props.regEx, 'gi');

            if ((val || '').match(reg) == (val || ''))
                valid &= true;
            else
                valid &= false;
        }
        return valid;
    }

    render() {
        let $this = this;
        let label;
        if ($this.props.label)
            label = <label>{$this.props.label}</label>;
        return (
            <div className='input-wrapper'>
                <input className={`input-field${$this.state.value ? ' full' : ''}${$this.state.valid ? '' : ' invalid'}`}
                    type="text"
                    ref={(input) => { this.pagesearchfield = input; }}
                    placeholder={$this.props.placeHolder}
                    onChange={$this.onChange}
                    value={$this.state.value}
                    autoFocus={!$this.state.IsHide}
                />
                <span className="bar main-bar" />
                {label}
            </div>
        );
    }
}

export class LabeledContent extends React.Component {
    render() {
        let labeledContent =
            <div className='labeled-content'>
                <div className='label'>{this.props.label}</div>
                <div className='content'>{this.props.children}</div>
            </div>;
        if (this.props.className) {
            return <div className={this.props.className}>{labeledContent}</div>
        } else {
            return labeledContent;
        }
    }
}