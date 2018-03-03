import React from 'react';
import { Lang } from './lang.jsx';
import { Page, Tils } from "./Components.jsx";

export class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: [],
            TotalPages: 10,
            CurrentPage: 1 || props.match.params.id || 1
        };
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(val) {

    }

    render() {
        let $this = this;
        return (
            <Page
                Title={Lang('scripts_title')}
                SubTitle={Lang('scripts_sub_title')}
                ShowAdditionalIcons={true}
                onSearch={$this.onSearch}>
                <Tils
                    Items={$this.state.Items || []}
                    TotalPages={$this.state.TotalPages}
                    CurrentPage={$this.state.CurrentPage} />
            </Page>);
    }
}