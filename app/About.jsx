import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components.jsx";
import { ApiInstance } from "./Api.jsx";

export class About extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Page
            Title={Lang('about_title')}
            SubTitle={Lang('about_sub_title')}
            ShowAdditionalIcons={true}
        >
            <span>О</span>
        </Page>;
    }
}