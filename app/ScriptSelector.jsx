import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components/Components.jsx";
import { Lun } from "./Scripts/Lun.jsx";
import { BadText } from "./Scripts/BadText.jsx";
import { Base64 } from "./Scripts/Base64.jsx";
import { Translit } from "./Scripts/Translit.jsx";
import { Guid } from "./Scripts/Guid.jsx";
import { NoMatch } from './NoMatch.jsx';
import { ApiInstance } from "./Api.jsx";
import { MarkdownContent } from "./Components/MarkdownContent.jsx";

class _ScriptSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            markdownContent: '',
            isLoading: false
        }
        this.selectContent = this.selectContent.bind(this);
        this.getLocalTitle = this.getLocalTitle.bind(this);
        this.getMarkdownContent = this.getMarkdownContent.bind(this);
        this.setLoading = this.setLoading.bind(this);
    }
    componentWillMount() {
        this.getMarkdownContent(this.state.id);
    }

    /** Придумать как сделать лучше */
    selectContent(id) {
        let trimmedId = (id || '').trim().toLowerCase();
        switch (trimmedId) {
            case 'lun':
                return <Lun />;
            case 'badtext':
                return <BadText />;
            case 'base64':
                return <Base64 />;
            case 'translit':
                return <Translit />;
            case 'guid':
                return <Guid />;
        }
    }

    /**Ф-я получающая локализированное значение заголовка, пока что заглушка. */
    getLocalTitle() {
        return Lang(`script_${this.state.id.toLowerCase()}`);
    }

    setLoading(val) {
        this.setState({ isLoading: val });
    }

    getMarkdownContent(id) {
        let $this = this;
        $this.setLoading(true);

        ApiInstance.Scripts.GetMarkdown(
            { id: id },
            (data) => {
                if (data) {
                    $this.setState({
                        markdownContent: data.Markdown,
                        isLoading: false
                    });
                }
            }
        );
    }

    render() {
        let $this = this;
        let page = $this.selectContent($this.state.id);
        if (page) {
            return (
                <Page
                    Title={$this.getLocalTitle()}
                    ShowAdditionalIcons={true}
                    isLoading={$this.state.isLoading}>
                    {page}
                    {$this.state.markdownContent ?
                        <div className='md-calc-wrapper'>
                            <MarkdownContent
                                value={$this.state.markdownContent} /> </div> : ''}
                </Page>
            );
        }
        else {
            return <NoMatch />
        }
    }
}

export const ScriptSelector = React.memo((props) => <_ScriptSelector {...props} />)