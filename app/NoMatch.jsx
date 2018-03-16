import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components.jsx";

export class NoMatch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Page
            Title={Lang('page_not_found_title')}
            SubTitle={Lang('page_not_found')}
            ShowAdditionalIcons={true}
        />;
    }
}