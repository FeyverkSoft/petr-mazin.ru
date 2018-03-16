import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components.jsx";
import { Lun } from "./Scripts/Lun.jsx";
import { BadText } from "./Scripts/BadText.jsx";
import { NoMatch } from './NoMatch.jsx';
export class ScriptSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id
        }
        this.selectContent = this.selectContent.bind(this);
        this.getLocalTitle = this.getLocalTitle.bind(this);
    }
    /** Придумать как сделать лучше */
    selectContent(id) {
        let trimmedId = (id || '').trim().toLowerCase();
        switch (trimmedId) {
            case 'lun':
                return <Lun />;
            case 'badtext':
                return <BadText />;
        }
    }
    /**Ф-я получающая локализированное значение заголовка, пока что заглушка. */
    getLocalTitle() {
        return Lang(`script_${this.state.id.toLowerCase()}`);
    }
    render() {
        let $this = this;
        let page = $this.selectContent($this.state.id);
        if (page) {
            return (
                <Page
                    Title={$this.getLocalTitle()}
                    ShowAdditionalIcons={true}
                >{page}</Page>
            );
        }
        else {
            return <NoMatch />
        }
    }
}