import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, NavLink, Switch } from 'react-router-dom';
import { Lang, setCookie, CurrentLang } from './lang.jsx';
import { Home } from './HomePage.jsx';
import { About } from './About.jsx';
import { Header } from './Menu.jsx';
import { Scripts } from './ScriptsPage.jsx';
import { ScriptSelector } from './ScriptSelector.jsx';
import { NoMatch } from './NoMatch.jsx';

/**Блок гугл гавнолитики */
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();
if (window.ga)
    window.ga('create', 'UA-115818194-1', 'auto');

history.listen((location, action) => {
    console.log(action, location.pathname);
    if (window.ga) {
        window.ga('set', 'page', location.pathname + location.search);
        window.ga('send', 'pageview', location.pathname + location.search);
    }
})
/**Конец блока гугл гавнолитики */

export default class MyApp extends React.Component {
    constructor(props) {
        super(props);
    }
    onChangeLang(lng) {
        if (CurrentLang() !== lng) {
            setCookie("Lang", lng);
            if (window)
                window.location.reload();
        }
    }
    render() {
        return (
            <Router history={history}>
                <div className="content">
                    <Header
                        onChangeLangCallback={this.onChangeLang}>
                        <li>
                            <NavLink to="/" exact activeClassName="active" >
                                <div className="link-text">{Lang('menu_home')}</div>
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
                    <div className="cover"></div>
                    <div className="body-wrapper">
                        <Switch>
                            <Route exact path='/' component={Home} />

                            <Route path='/scripts/:id' component={ScriptSelector} />
                            <Route path='/scripts' component={Scripts} />

                            <Route exact path='/about' component={About} />

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