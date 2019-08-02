/**
 * Страница с информацией обо мне
 */
import React from 'react';
import { Lang } from './lang.jsx';
import { Page } from "./Components/Components.jsx";
import { ApiInstance, hashVal } from "./Api.jsx";
import { MarkdownContent } from "./Components/MarkdownContent.jsx";

export class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: props.match.params.test || hashVal('test') || false,
            markdownContent: `##:(center) О моем блоге
Привет, меня зовут Пётр, я профессионально (и не очень :D ) занимаюсь back end разработкой и созданием различных, том числе и коммерческих проектов.
А ещё увлекаюсь Front end технологиями и микроконтроллерами. (Если точнее esp8266/32) 
Под микрики пишу на C++ 11 (platformio) Хотелось бы конечно писать на C++17 но прошивка не умешается :)

В этом бложике будут публиковаться разные статейки, заметки, скрипты, и иного рода интересный для меня контент.
Возможно отчёты о проделанной работе или что-то ещё. А возможно я забъю на этот сайт и буду его обновлять отсилу раз в пару лет.

Посмотреть скрипты вы всегда сможете в разделе !:/scripts:скриптов:!, а новости и заметки  !:./:тут:!,

__Технологии:__
|(center) Программирование |(center) Языки разметки, формат обмена |(center) Web библиотеки, фреймворки, cms | БД |
| C#, TypeScript, Java, С++17, ~~JavaScript~~ | HTML, LESS, SCSS, CSS, XML, JSON | React Js/Redux, Vue.JS, ~~jQuery, Bootstrap 3, AKKA (C#)~~ | MS SQL Server, PostgreSql, Mongo, MariaDB |

__Навыки:__
OOP, SOLID, DDD, CQRS, DI/IOC, (СI/CD), docker, (TDD), (Agile)
опыт разработки коммерческих приложений на платформе .NET более 5 лет
опыт разработки коммерческих приложений С++17

__Cистемы контроля версий:__
git (git-flow), github, bitbucket, gitlab

__Опыт работы__
avalab.io - Avatar Lab
w1.ru - Единый кошелек
Фриланс/Хобби



PS: Возможно тут будет ещё и портфолио, но как-то лень...
PSPS: Так получилось что когда я делал этот сайт я плохо знал react :) А теперь лень переписывать :)

Hello, world!`
        }
    }

    render() {
        let markdownContent = `##:(center) Ресурс находится в перманентной разработке, :D 
Sometimes you want numbered lists:
!=== info
1. One
2. Two :)
3. Three

___

Sometimes you want bullet points: :)

* Start a line with a star
* Profit!

Alternatively,

- Dashes work just as well
- And if you have sub points, put two spaces before the dash or star:
  - Like this
  - And this
!===
# Structured documents
Sometimes it's useful to have different levels of headings to structure your documents. 
Start lines with a \`#\` to create headings. Multiple \`##\` in a row denote smaller heading sizes.
### This is a third-tier heading
You can use one \`#\` all the way up to \`######\` six for different heading sizes.

If you'd like to quote someone, use the > character before the line:
> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> - Captain Janeway

*This text will be italic*
_This will also be italic_

**This text will be :) bold**
__This will also be bold__

!:/scripts:скрипты:!

!(/img/logo.png:center)

 _You **can** combine them_

\`\`\` js
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
\`\`\`

~|First Header | Second Header|
|(center) Content !(/img/logo.png)!#from cell 1!#NL from cell 1 | Content from cell 2|
|Content in the first column | Content in the second column :) |

# And flex-box table
|! center:2
Content !(/img/logo.png)!#from cell 1 
|
Content from cell 2 Line 1 :)
Content from cell 2 Line 2
!=== 
dfdfdf
!===
!|

|!:2
Content in the first column :)
|
Content in the second column
!|
`

        return (
            <Page
                Title={Lang('about_title')}
                ShowAdditionalIcons={true}>
                <MarkdownContent value={this.state.test == 'true' ? markdownContent : this.state.markdownContent} />
            </Page>);
    }
}