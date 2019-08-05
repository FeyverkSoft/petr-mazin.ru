import React from 'react';
import { Lang, CurrentLang } from './lang.jsx';

class LangSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            langList: props.langList || ['ru']
        };
    }
    setLang(lang) {
        if (this.props.onChangeLangCallback)
            this.props.onChangeLangCallback(lang);
    }
    render() {
        let $this = this;
        let langList = [CurrentLang()];
        langList = langList.concat($this.state.langList.filter((item) => item !== CurrentLang()));
        return (
            <div className="lang-selector">
                <ul className="items">
                    {langList.map((item) => {
                        return (<li key={`lang+${item}`}
                            className="item"
                            lang={item}
                            onClick={() => $this.setLang(item)}>
                            {Lang(item)}
                        </li>);
                    })}</ul>
            </div>);
    }
}

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu(tm) {
        if (this.props.onToggleMenu) {
            this.props.onToggleMenu();
        }
    }
    render() {
        let $this = this;
        return (
            <header className="header">
                <div className="logo"></div>
                <div className="menu-button" onClick={$this.toggleMenu}>
                    <div className="icon-wr">
                        <span className={`css-icon ${$this.props.menueHide ? 'menu-ico' : 'more-vertical'}`} />
                    </div>
                </div>
                <nav className={`menu ${$this.props.menueHide ? 'menu-hide' : ''}`}>
                    <ul>
                        {this.props.children}
                    </ul>
                </nav>
                <LangSelector
                    onChangeLangCallback={$this.props.onChangeLangCallback}
                    langList={['ru', 'en']} />
            </header>
        );
    }
}
