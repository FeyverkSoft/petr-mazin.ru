/**
 * Файл с разными компонентами, надо бы его попилить на куски, но ну на.
 */
import React from 'react';
import { ApiInstance, getGuid } from "../Api.jsx";
import { Lang } from '../lang.jsx';
import { OmniTextBox, LinkButton } from './InputAndButton.jsx';

/// Холст 
export class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            additionalIcons: this.props.AdditionalIcons || []
        }
        this.getAdditionalIcons = this.getAdditionalIcons.bind(this);
    }

    componentWillMount() {
        if (this.props.ShowAdditionalIcons)
            this.getAdditionalIcons();
    }
    ///получаем значки соц сетей
    getAdditionalIcons() {
        if (this.props.AdditionalIcons) {
            this.setState({ additionalIcons: $this.props.AdditionalIcons });
        }
        else {
            ApiInstance.MainData.GetAdditionalIcons((data) => {
                this.setState({ additionalIcons: data });
            });
        }
    }
    render() {
        let shovSt = this.props.SubTitle != undefined;
        let searchField = this.props.onSearch != undefined;
        return (
            <div className="page">
                <div className="page-title">{this.props.Title}</div>
                <div className={this.props.className ? `paper ${this.props.className}` : 'paper'}>
                    {searchField ?
                        <div className="search-field">
                            <OmniTextBox
                                icons="search"
                                placeHolder={Lang("search")}
                                onChange={this.props.onSearch}
                                value={this.props.searchValue}
                            />
                        </div> : ''}
                    {shovSt ?
                        <div className="sub-title">
                            {this.props.SubTitle}
                        </div>
                        : ''}
                    <div className="paper-content">
                        {//Анимация загрузки
                            this.props.isLoading ? <Spinner /> : ''
                        }
                        {this.props.children}
                    </div>
                    {
                        //<!--AdditionalIcons блок дополнительных значков -->
                        this.props.ShowAdditionalIcons && this.state.additionalIcons && this.state.additionalIcons.length > 0 ?
                            <AdditionalIcons items={this.state.additionalIcons}
                                pageTitle={(this.props.Title || '') + ' ' + (this.props.SubTitle || '')} /> :
                            ''
                    }
                </div>
            </div>
        );
    }
}

// значки соц сетей и иной ериси с низу странички
export class AdditionalIcons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items || [],
            pageTitle: props.pageTitle || ''
        };
        this.getData = this.getData.bind(this);
        this.iconClick = this.iconClick.bind(this);
    }
    getData(name) {
        if (name)
            switch (name.toLowerCase().trim()) {
                case "_uri":
                    return window.location + '';
                case "_title":
                    return this.state.pageTitle;
            }
        return name;
    }
    iconClick(e) {
        if (e && e.target && e.target.dataset && e.target.dataset['id']) {
            let $this = this;
            let item = $this.state.items.firstOrDefault(x => (x.id || item.icon) == e.target.dataset['id']);
            if (item.uri) {
                let uri = item.uri;
                if (item.isShareLink) {
                    uri = `${uri}?`;
                    if (item.shareParams)
                        item.shareParams.forEach(element => {
                            let data = $this.getData(element.val);
                            if (data && data != '')
                                uri = `${uri}${element.name}=${data}&`
                        });
                }
                window.open(uri.trim("&"), '_blank');
            }
        }
        return;
    }
    render() {
        let $this = this;
        return (
            <div className="additional-icons-wrapper">
                {
                    $this.state.items.map(item => {
                        return (
                            <div className={`icons ${item.icon}`}
                                data-id={item.id || item.icon}
                                key={`icon${item.id || item.icon}`}
                                onClick={$this.iconClick}></div>
                        )
                    })
                }
            </div>);
    }
}

///Плашки
export class Tils extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentItems: props.Items || []
        };
    }
    componentWillReceiveProps(props) {
        if (props.Items != this.state.Items)
            this.setState({
                CurrentItems: props.Items || []
            });
    }

    render() {
        let $this = this;
        if (!$this.state.CurrentItems || $this.state.CurrentItems.length == 0) {
            return (
                <div className="deserted">
                    {Lang('deserted')}
                </div>);
        }
        return (
            <div className="col-wrapper">
                {$this.state.CurrentItems.map(x => {
                    let til = <Til key={x.Id}
                        Id={x.Id}
                        Title={x.Title}
                        Description={x.Description}
                        Date={x.Date}
                        onClick={$this.props.onSelectedTil}
                        Cover={x.Cover}
                    />;
                    return $this.props.columnCount ?
                        <div className={`col-${$this.props.columnCount}`}
                            key={getGuid()}>
                            {til}
                        </div> : til
                })}
            </div>);
    }
}
///Плашка
export class Til extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.Id,
            Title: props.Title,
            Description: props.Description,
            Date: props.Date,
            Cover: props.Cover
        };
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.state.id);
        }
    }
    render() {
        let $this = this;
        let imgStyle = { background: `url('${$this.state.Cover}') no-repeat left center` };
        return (
            <div className='til'
                onClick={$this.onClick}>
                {$this.state.Cover ?
                    <div className="img" style={imgStyle}> </div>
                    : ''
                }
                <div className="til-content-wrapper">
                    <div className="til-content">
                        <div className='til-title'>{$this.state.Title}</div>
                        <div>{$this.state.Description}</div>
                    </div>
                    <div className='til-footer'>
                        <time className='light-text'>{$this.state.Date}</time>
                        <LinkButton value={Lang('more_info')} />
                    </div>
                </div>
            </div>);
    }
}

///Пагинатор
export class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Count: props.TotalPages,
            CurrentPage: props.CurrentPage
        };
        this.selectedPage = this.selectedPage.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            Count: props.TotalPages,
            CurrentPage: props.CurrentPage
        });
    }
    //надо бы переписать эту дичь :D
    getItems() {
        class items {
            index;
            body;
            className;
            constructor(index, body, className) {
                this.index = index;
                this.body = body;
                this.className = className;
            }
        }
        let $this = this;
        let arr = [];
        for (let i = 1; i <= this.state.Count; i++) {
            if ($this.state.CurrentPage == i + 1 || $this.state.CurrentPage == i - 1) {
                arr = arr.concat(new items(i, i))
            } else {
                if ($this.state.CurrentPage == i) {
                    arr = arr.concat(new items(i, i, 'active'));
                }
                else {
                    if (i == 1 || i == this.state.Count)
                        arr = arr.concat(new items(i, i));
                }
            }
        }
        var unique = {};
        var distinct = [];
        for (var i in arr) {
            if (typeof (unique[arr[i].index]) == "undefined" && arr[i].index) {
                distinct.push(arr[i]);
            }
            unique[arr[i].index] = 0;
        }
        arr = distinct;
        if ($this.state.CurrentPage > 1)
            arr = [new items($this.state.CurrentPage - 1, 'keyboard_arrow_left', 'material-icon')].concat(arr);
        if ($this.state.CurrentPage < $this.state.Count)
            arr.push(new items(parseInt(1) + parseInt($this.state.CurrentPage), 'keyboard_arrow_right', 'material-icon'));

        let result = [];
        for (let i = 0; i < arr.length; i++) {
            result = result.concat(arr[i]);
            if (arr[i + 1] && arr[i + 1].index)
                if ((Math.abs(arr[i + 1].index) - Math.abs(arr[i].index)) > 1) {
                    if (arr[i - 1] && arr[i - 1].index != -1)
                        result = result.concat(new items(-1, 'more_horiz', 'material-icon'));
                }
        }
        return result;
    }

    selectedPage(e) {
        if (e && e.target && e.target.id && e.target.id != -1 && e.target.id != this.state.CurrentPage) {
            let currentPage = parseInt(e.target.id);
            this.setState({ CurrentPage: currentPage });
            if (this.props.onSelectPage)
                this.props.onSelectPage(currentPage);
        }
    }

    render() {
        let $this = this;
        let items = $this.getItems();
        return (
            <div className="pagination">
                {items.map(x => {
                    return (
                        <div key={getGuid()}
                            className={`pg ${x.className ? x.className : ''}`}
                            onClick={$this.selectedPage}
                            id={x.index || -1}>{x.body}</div>
                    )
                })}
            </div>);
    }
}

export class Spinner extends React.Component {
    render() {
        return (
            <div className="loading-overlay">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }
}