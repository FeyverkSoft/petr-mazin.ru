import React from 'react';
import { Lang } from './lang.jsx';
import { Page, Tils, Pagination } from "./Components/Components.jsx";
import { ApiInstance, hashVal } from "./Api.jsx";

export class Scripts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: [],
            TotalPages: 0,
            CurrentPage: props.match.params.id || hashVal('page') || 1,
            ItemPerPage: props.match.params.count || hashVal('count') || 10,
            Search: props.match.params.search || hashVal('search') || '',
            isLoading: false,
            columnCount: 2
        };
        this.loadData = this.loadData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSelectedTil = this.onSelectedTil.bind(this);
        this.onSelectPage = this.onSelectPage.bind(this);
        this.updateHash = this.updateHash.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            CurrentPage: props.match.params.id || hashVal('page') || this.state.CurrentPage || 1,
            ItemPerPage: props.match.params.count || hashVal('count') || this.state.ItemPerPage || 10,
            Search: props.match.params.search || hashVal('search') || this.state.Search || '',
            isLoading: true
        }, this.loadData);
    }

    componentWillMount() {
        this.loadData();
    }

    loadData(page, search, collback) {
        let $this = this;
        let ItemPerPage = $this.state.ItemPerPage;
        ApiInstance.Scripts.GetScripts(
            {
                search: search || $this.state.Search,
                page: page || $this.state.CurrentPage,
                itemPerPage: ItemPerPage
            },
            (data) => {
                if (data) {
                    let totalPage = parseInt(data.totalCount / ItemPerPage);
                    $this.setState({
                        Items: data.items,
                        TotalPages: totalPage + (totalPage * ItemPerPage == data.totalCount ? 0 : 1),
                        CurrentPage: data.page,
                        Search: search || $this.state.Search,
                        isLoading: false
                    }, collback);
                }
            })
    }

    onSearch(val) {
        this.setState({
            Search: val,
            CurrentPage: 1
        }, this.updateHash)
    }
    onSelectPage(page) {
        this.setState({ CurrentPage: page }, this.updateHash);
    }
    //неявно вызывает componentWillReceiveProps
    updateHash() {
        this.props.history.push({
            hash:
                `#page=${this.state.CurrentPage}` +
                `${(this.state.Search || '') != '' ? `&search=${encodeURI(this.state.Search)}` : ''}` +
                `${(this.state.ItemPerPage || '') != '' ? `&count=${this.state.ItemPerPage}` : ''}`
        });
    }


    onSelectedTil(val) {
        this.props.history.push({
            pathname: `${this.props.location.pathname}/${val}`
        });
    }

    render() {
        let $this = this;
        return (
            <Page
                Title={Lang('scripts_title')}
                SubTitle={Lang('scripts_sub_title')}
                ShowAdditionalIcons={true}
                onSearch={$this.onSearch}
                searchValue={$this.state.Search}
                isLoading={$this.state.isLoading}>
                <Tils
                    Items={$this.state.Items || []}
                    TotalPages={$this.state.TotalPages}
                    CurrentPage={$this.state.CurrentPage}
                    onSelectedTil={$this.onSelectedTil}
                    columnCount={$this.state.columnCount}
                    className='large' />
                <div className={'pagination-wrapper'}>
                    <Pagination
                        CurrentPage={$this.state.CurrentPage}
                        TotalPages={$this.state.TotalPages}
                        onSelectPage={$this.onSelectPage}
                    />
                </div>
            </Page>);
    }
}