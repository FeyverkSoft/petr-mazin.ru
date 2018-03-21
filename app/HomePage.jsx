import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components/Components.jsx";
import { ApiInstance } from "./Api.jsx";
import { MarkdownContent } from "./Components/MarkdownContent.jsx";
export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Page
            Title={Lang('homepage_title')}
            SubTitle={Lang('home_page_sub_title')}
            ShowAdditionalIcons={true}
        >
            Ресурс находится в перманентной разработке, :D
            <MarkdownContent
                value='MarkdownContent' />
        </Page>;
    }
}