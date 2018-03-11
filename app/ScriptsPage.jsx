import React from 'react';
import { Lang } from './lang.jsx';
import { Page, Tils } from "./Components.jsx";
import { ApiInstance, hashVal } from "./Api.jsx";

export class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: [],
            TotalPages: 0,
            CurrentPage: props.match.params.id || hashVal('id') || 1,
            ItemPerPage: props.match.params.count || hashVal('count') || 10,
            Search: props.match.params.search || hashVal('search') || ''
        };
        this.loadData = this.loadData.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            CurrentPage: props.match.params.id || hashVal('id') || 1,
            ItemPerPage: props.match.params.count || hashVal('count') || 10,
            Search: props.match.params.search || hashVal('search') || ''
        }, this.loadData);
    }

    loadData() {
        let $this = this;
        ApiInstance.Scripts.GetScripts(
            {
                search: $this.state.Search,
                page: $this.state.CurrentPage,
                itemPerPage: $this.state.ItemPerPage
            },
            (data) => {
                if (data) {
                    $this.setState({
                        Items: data.scripts,
                        TotalPages: parseInt(data.totalCount / $this.state.ItemPerPage) + 1,
                        CurrentPage: data.page,
                        Search: $this.state.Search
                    });
                }
            })
    }

    componentWillMount() {
        this.loadData();
    }

    onSearch(val) {
        let $this = this;
        ApiInstance.Scripts.GetScripts(
            { search: val, page: 1, itemPerPage: $this.state.ItemPerPage },
            (data) => {
                if (data) {
                    $this.setState({
                        Items: data.scripts,
                        TotalPages: parseInt(data.totalCount / $this.state.ItemPerPage) + 1,
                        CurrentPage: data.page,
                        Search: val
                    });
                }
            })
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