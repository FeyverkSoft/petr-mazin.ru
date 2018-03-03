import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, NavLink, Switch } from 'react-router-dom';
import { Lang, setCookie, CurrentLang } from './lang.jsx';
import { Home } from './HomePage.jsx';
import { About } from './About.jsx';
import { Header } from './Menu.jsx';
import { Scripts } from './ScriptsPage.jsx';

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
            <BrowserRouter>
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
                        <Route exact path='/' component={Home} />
                        <Switch>
                            <Route path='/scripts' component={Scripts} />
                            <Route path='/scripts/:id' component={Scripts} />
                        </Switch>
                        <Route path='/script/:id' component={Scripts} />
                        <Route exact path='/about' component={About} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

render(
    <MyApp />,
    document.getElementById('app')
);
/*
<Route path='/scripts' component={Scripts} />
<Route path='/about' component={About} />
*/

