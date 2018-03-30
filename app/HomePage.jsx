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
        let markdownContent = `Sometimes you want numbered lists:
!=== info
1. One
2. Two
3. Three

Sometimes you want bullet points:

* Start a line with a star
* Profit!

Alternatively,

- Dashes work just as well
- And if you have sub points, put two spaces before the dash or star:
  - Like this
  - And this
!===

# Structured documents

Sometimes it's useful to have different levels of headings to structure your documents. Start lines with a \`#\` to create headings. Multiple \`##\` in a row denote smaller heading sizes.

### This is a third-tier heading

You can use one \`#\` all the way up to \`######\` six for different heading sizes.

If you'd like to quote someone, use the > character before the line:

> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> - Captain Janeway

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

!:/script:скрипты:!

!(/img/logo.png)

 _You **can** combine them_

\`\`\` js
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
\`\`\`

~|First Header | Second Header|
|(center) Content !(/img/logo.png)!#from cell 1 | Content from cell 2|
|Content in the first column | Content in the second column|`

        return <Page
            Title={Lang('homepage_title')}
            SubTitle={Lang('home_page_sub_title')}
            ShowAdditionalIcons={true}
        >
            Ресурс находится в перманентной разработке, :D Ниже тест самопального парсера Markdown
            <MarkdownContent
                value={markdownContent} />
        </Page>;
    }
}