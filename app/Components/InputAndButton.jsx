import React from 'react';
import { ApiInstance, getGuid } from "../Api.jsx";
import { Lang } from '../lang.jsx';

///Текстовое поле поиска в материал дезайн стиле
export class OmniTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IsHide: this.props.isHide || ((this.props.value || '') == ''),
            value: this.props.value || '',
            typingTimeOut: 0,
            path: props.path
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
                    $this.props.onChange($this.state.value, true, $this.state.path);
                }, 500)
            });
        }
    }

    render() {
        let $this = this;
        return (
            <div className="omni-field">
                <span className="open-icon"
                    onClick={$this.show}>
                    <div className={`css-icon ${$this.props.icons}`}></div>
                </span>
                <div className={`input-field-wrapper ${$this.state.IsHide ? 'hide-field' : ''}`}>
                    <input className="input-field"
                        ref={(input) => { this.pagesearchfield = input; }}
                        placeholder={$this.props.placeHolder}
                        onChange={$this.onChange}
                        value={$this.state.value}
                        autoFocus={!$this.state.IsHide}
                        data-path={$this.state.path}
                    />
                    <span className="bar main-bar" />
                    <span className={`close-icon ${$this.state.IsHide ? 'hide' : ''}`}
                        onClick={$this.hide}>
                        <div className={`css-icon close`}></div>
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
        if (!this.props.disabled && this.props.onClick) {
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
            <div className={`button${disabled} ${this.props.className ? this.props.className : ''}`}
                onClick={this.onClick}
                style={this.props.style}>
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
            valid: true,
            path: props.path
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
        if (this.props.ignoreInvalidValue && !valid && val != '')
            return;
        if ($this.state.typingTimeout) {
            clearTimeout($this.state.typingTimeout);
        }

        $this.setState({
            value: val,
            typingTimeout: setTimeout(function () {
                if ($this.props.onChange) {
                    $this.props.onChange(val, valid, $this.state.path);
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
        if (($this.props.regEx || $this.props.regExp) && val) {
            let reg = new RegExp(($this.props.regEx || $this.props.regExp), 'gi');

            if ((val || '').match(reg) == (val || ''))
                valid &= true;
            else
                valid &= false;
        }
        return valid;
    }

    render() {
        let $this = this;
        let label, valid;
        if ($this.props.label)
            label = <label>{Lang($this.props.label)}</label>;
        if (!$this.state.valid && $this.props.regExMessage)
            valid = <span className='valid-message'>{$this.props.regExMessage}</span>;
        return (
            <div className='input-wrapper'>
                <input className={`input-field${$this.state.value ? ' full' : ''}${$this.state.valid ? '' : ' invalid'}`}
                    type="text"
                    id={$this.props.id}
                    name={$this.props.id}
                    ref={(input) => { this.pagesearchfield = input; }}
                    placeholder={$this.props.placeHolder}
                    onChange={$this.onChange}
                    value={$this.state.value}
                    autoFocus={!$this.state.IsHide}
                    data-path={$this.state.path}
                    disabled={$this.props.disabled == true}
                />
                <span className="bar main-bar" />
                {label}
                {valid}
            </div>
        );
    }
}

export class LabeledContent extends React.Component {
    render() {
        let labeledContent =
            <div className='labeled-content'>
                <div className='label'>{Lang(this.props.label)}</div>
                <div className='content'>{this.props.children}</div>
            </div>;
        if (this.props.className) {
            return <div className={this.props.className}>{labeledContent}</div>
        } else {
            return labeledContent;
        }
    }
}

export class AreaInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            typingTimeOut: 0,
            timeout: this.props.timeout || 200,
            valid: true,
            path: this.props.path
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
                    $this.props.onChange(val, valid, $this.state.path);
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
            label = <label>{Lang($this.props.label)}</label>;
        return (
            <div className='input-wrapper'>
                <textarea
                    id={$this.props.id}
                    name={$this.props.id}
                    className={`input-textarea${$this.state.value ? ' full' : ''}${$this.state.valid ? '' : ' invalid'}`}
                    type="text"
                    ref={(input) => { this.pagesearchfield = input; }}
                    placeholder={$this.props.placeHolder}
                    onChange={$this.onChange}
                    value={$this.state.value}
                    autoFocus={!$this.state.IsHide}
                    data-path={$this.state.path}
                />
                <span className="bar main-bar" />
                {label}
            </div>
        );
    }
}

export class Item {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    get Key() {
        return this.value || this.name;
    }
}

export class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            items: props.items || [],
            path: props.path
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if (this.state.value != (props.value || '') ||
            props.items != this.state.items ||
            this.state.path != props.path
        ) {
            this.setState({
                value: props.value || '',
                items: props.items || [],
                path: props.path
            });
        }
    }

    onChange(val) {
        let $this = this;
        let value = val.target.value;
        if (value != $this.state.value) {
            $this.setState({
                value: value
            });
            $this.props.onChange(value, true, $this.state.path);
        }
    }
    render() {
        let $this = this;
        let label;
        if ($this.props.label)
            label = <label>{$this.props.label}</label>;
        return (
            <div className={`select-wrapper ${$this.props.className ? $this.props.className : ''}`}
                style={$this.props.style}>
                {label}
                <select
                    id={$this.props.id}
                    name={$this.props.id}
                    onChange={$this.onChange}
                    data-path={$this.state.path}
                    value={$this.state.value}>
                    {
                        $this.state.items.map((item) => {
                            return <option key={item.Key || item} value={item.value || item}> {item.name || item.value || item} </option>;
                        })
                    }
                </select>
                <span className="bar main-bar" />
            </div>
        )
    }
}

export class LabeledPre extends React.Component {
    render() {
        let labeledContent =
            <div className='labeled-pre'>
                <label>{Lang(this.props.label)}</label>
                <pre>{this.props.value || this.props.children}</pre>
            </div>;
        if (this.props.className) {
            return <div className={this.props.className}>{labeledContent}</div>
        } else {
            return labeledContent;
        }
    }
}

export class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '',
            valid: true,
            path: props.path
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
        let val = event.target.checked;
        let valid = $this.validate(val);

        if ($this.props.onChange) {
            $this.props.onChange(val, valid, $this.state.path);
            $this.setState({ value: val });
        } else
            $this.setState({ value: val });
    }

    validate(value) {
        let $this = this;
        let val = (value || ($this.state || {}).value);
        let valid = true;
        if ($this.props.IsRequired && !val)
            valid &= false;
        return valid;
    }

    render() {
        let $this = this;
        let id = $this.props.id || getGuid();
        return (
            <div className='toggle-wrapper'>
                <input className={`toggle${$this.state.valid ? '' : ' invalid'}`}
                    type="checkbox"
                    id={id}
                    name={$this.props.id}
                    onChange={$this.onChange}
                    checked={$this.state.value}
                    data-path={$this.state.path}
                    disabled={$this.props.disabled}
                />
                <label htmlFor={id}></label>
            </div>
        );
    }
}

export class ListItem extends React.Component {
    render() {
        return (
            <div className={`border${this.props.className ? ` ${this.props.className}` : ' smart-padding col-2'}`}>
                <div className={`list-item${this.props.disabled ? ' disabled' : ''}`}>
                    <div className="list-content-wrapper">
                        <label>{Lang(this.props.label)}</label>
                        <div className={`description${this.props.disabled ? ' disabled' : ''}`}>{Lang(this.props.description)}</div>
                    </div>
                    <div className="element-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export class MaterialList extends React.Component {
    render() {
        let label;
        if (this.props.title)
            label = <label className="title">{Lang(this.props.title)}</label>;
        return (
            <div className='material-list'>
                {label}
                <div className="content">
                    <div className="col-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}