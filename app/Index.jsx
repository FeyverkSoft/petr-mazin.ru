import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, NavLink, Switch } from 'react-router-dom';
import { Lang, setCookie, CurrentLang } from './lang.jsx';
import { Home } from './HomePage.jsx';
import { About } from './About.jsx';
import { Header } from './Menu.jsx';
import { Scripts } from './ScriptsPage.jsx';
import { News } from './News.jsx';
import { ScriptSelector } from './ScriptSelector.jsx';
import { NoMatch } from './NoMatch.jsx';
import { getRandomInt } from './Api.jsx';

/**Блок гугл гавнолитики */
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();
if (window.ga)
    window.ga('create', 'UA-115818194-1', 'auto');
/**Конец блока гугл гавнолитики */

export default class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menueHide: true,
            bg: "bg-1"
        }
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
    }

    componentWillMount() {
        if (history) {
            history.listen(this.onLocationChange);
        }
        if (window)
            window.addEventListener('scroll', this.onScroll);
    }

    onLocationChange(location, action) {
        let $this = this;
        if (!$this.state.menueHide)
            $this.setState({ menueHide: true });
        //console.log(action, location.pathname);
        if (window.ga) {
            window.ga('set', 'page', location.pathname + location.search);
            window.ga('send', 'pageview', location.pathname + location.search);
        }
        if (location)
            this.calcBg(location.pathname);
    }

    onChangeLang(lng) {
        if (CurrentLang() !== lng) {
            setCookie("Lang", lng);
            if (window)
                window.location.reload();
        }
    }
    onToggleMenu() {
        this.setState({ menueHide: !this.state.menueHide });
    }

    calcBg = (location) => {
        if (location && (location.indexOf('script') != -1)) {
            this.setState({ bg: `bg-2` });
        }
        else {
            this.setState({ bg: `bg-1` });
        }
    }

    render() {
        return (
            <Router history={history}
                onScroll={this.onScroll}>
                <div className="content">
                    <Header
                        onChangeLangCallback={this.onChangeLang}
                        menueHide={this.state.menueHide}
                        onToggleMenu={this.onToggleMenu}
                        minifi={this.state.minifiMenu}>
                        <li>
                            <NavLink to="/" activeClassName="active"
                                isActive={(match, location) => /\/(?!\w)|(\/\d{1,10}(?!\w))/.test(location.pathname)}>
                                <div className='link-text'>{Lang('menu_home')}</div>
                                <span className="bar light-bar" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/scripts" activeClassName="active" >
                                <div className="link-text">{Lang('menu_scripts')}</div>
                                <span className="bar light-bar" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" exact activeClassName="active" >
                                <div className="link-text">{Lang('menu_about')}</div>
                                <span className="bar light-bar" />
                            </NavLink>
                        </li>
                    </Header>
                    <div className={`cover ${this.state.bg}`}></div>
                    <div className="body-wrapper">
                        <Switch>
                            <Route path='/scripts/:id' component={ScriptSelector} />
                            <Route path='/scripts' component={Scripts} />

                            <Route exact path='/about' component={About} />

                            <Route path='/:id([\d]{1,10})' component={News} />
                            <Route path='/' component={Home} />

                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

render(
    <MyApp />,
    document.getElementById('app')
);