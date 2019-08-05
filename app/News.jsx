import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components/Components.jsx";
import { ApiInstance } from "./Api.jsx";
import { MarkdownContent } from "./Components/MarkdownContent.jsx";
import { NoMatch } from './NoMatch.jsx'

class _News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            markdownContent: '',
            title: '',
            isLoading: false
        }
        this.getMarkdownContent = this.getMarkdownContent.bind(this);
        this.setLoading = this.setLoading.bind(this);
    }
    componentWillMount() {
        this.getMarkdownContent(this.state.id);
    }

    setLoading(val) {
        this.setState({ isLoading: val });
    }

    getMarkdownContent(id) {
        let $this = this;
        $this.setLoading(true);

        ApiInstance.News.GetMarkdown(
            { id: id },
            (data) => {
                if (data) {
                    $this.setState({
                        markdownContent: data.Markdown,
                        title: data.Title,
                        isLoading: false
                    });
                }
            }
        );
    }

    render() {
        let $this = this;
        if ($this.state.markdownContent) {
            return (
                <Page
                    Title={$this.state.title}
                    ShowAdditionalIcons={true}
                    isLoading={$this.state.isLoading}>
                    {$this.state.markdownContent ?
                        <MarkdownContent
                            value={$this.state.markdownContent} /> : ''}
                </Page>
            );
        }
        else {
            return <NoMatch />
        }
    }
}

export const News = React.memo((props) => <_News {...props} />)