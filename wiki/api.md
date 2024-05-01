The api is reachable from the variable `game.modules.get('choices-plus').api` or from the socket libary `socketLib` on the variable `game.modules.get('choices-plus').socket` if present and active.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API](../src/scripts/api.js)

You can find some javascript examples here **=> [macros](./macros/) <=**

#### showChoices({options}):void ⇒ <code>Promise&lt;void&gt;</code>

**Note on chaining IF YOU USE THE DEPRECATED CHAT OPTION :** If you want to chain choices, the choice needs to have `democracy=true` and `resolveGM=true`, any option that calls another choice needs to have `chain=true`

**Note on chaining IF YOU USE THE NEW API OPTION :** If you want to chain choices, the choice needs to have and, any option that calls another choice needs to have `chain=true` and a reference to the other choice macro `macro=xxx` (the xxx is this case usually a macro reference to another `game.modules.get("choices-plus").api.showChoices`, but there is no control about it).

**Note on the execution of the macro:** executes Macro command, giving speaker, actor, token, character, and event constants. This is recognized as the macro itself. Pass an event as the first argument. Is the same concept used from [Item Macro](https://github.com/Foundry-Workshop/Item-Macro/), but without the item, also the main reference is not the item, but the actor, we used the actor set as character by default or the first owned actor by the user, same concept of [Item Piles](https://github.com/fantasycalendar/FoundryVTT-ItemPiles). The macro is launched under as a asynchronus call so  `await ` command are good.

So when you set up to run a macro with this module these arguments are already "setted":`
- **speaker**: The chat message speaker referenced to the actor.
- **actor**: The actor reference.
- **token**: The token (if present on the current scene), referenced to the actor.
- **character**: The character is the actor reference to the one setted to the specific player (cannot be the same of the actor reference).
- **event**: The javascript event passed from the module to the macro.
- **args**: Additional arguments passed from the module to the macro.



**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| options | `object` | | The options to pass to the function
| [options.title] | <code>string</code> | The big title for the choice | |
| [options.text] | <code>string</code> | The little (and short), summary text for the choice | NOTE: You can use html core and document link on this text |
| [options.key] | <code>string</code> | OPTIONAL: The explicit key identifier to associate to this choice it used on some chain event. If not key is given by default the 'title' is used instead. | |
| [options.main] | <code>boolean</code> | OPTIONAL: true or false, determines if current choices is the main one. usually only one choice has the main value to true, if no main is set the first choice of the array is the one launched (default false) | |
| [options.fastClick] | <code>boolean</code> | OPTIONAL: true or false, determines if to resolve a choice with the click instead to click a second time on the green button on the top right (default false). | |
| [options.multi] | <code>boolean</code> | OPTIONAL: true or false, determines if multiple choices can be selected (default false) | |
| [options.time] | <code>number</code> | OPTIONAL: The number of seconds for make a decision (default 0) | |
| [options.img] | <code>string</code> | OPTIONAL: the path to the image to be displayed as the background (default null) | |
| [options.show] | <code>boolean</code> | OPTIONAL: true or false, determines if show the active choice | Working in progress for a better behavior (default true)  |
| [options.player] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of player names, if not provided all players will get to chose | NOTE: You can use user name, or id or uuid associated to a user |
| [options.democracy] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice with the highest votes will be picked (if true) or resolve the choice per player (if false) (default true) | |
| [options.default] | <code>number</code> | OPTIONAL: the default choice if no choice is made (default 0 the first choice on the list) | Working in progress for a better behavior (default 0) |
| [options.displayResult] | <code>boolean</code> | OPTIONAL: true or false, determine if the result will be output to chat after the choice is made (default true) | |
| [options.resolveGM] | <code>boolean</code> | OPTIONAL: true or false, determine if the resolution of the choice should run on the gm side as well (default false) | |
| [options.portraits] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of actor names, if not provided no portrait is show | NOTE: You can use actor name, or id or uuid associated to a actor |
| [options.textColor] | <code>string</code> | OPTIONAL: apply a text color as css on the choice (default #000000eb) | |
| [options.backgroundColor] | <code>string</code> | OPTIONAL: apply a background color as css on the choice (default #000000ff) | |
| [options.buttonColor] | <code>string</code> | OPTIONAL: apply a button color as css on the choice (default #ffffffd8) | |
| [options.buttonHoverColor] | <code>string</code> | OPTIONAL: apply a button color as css when hover on the choice (default  #c8c8c8d8)| |
| [options.buttonActiveColor] | <code>string</code> | OPTIONAL: apply a button color as css when set active on the choice (default #838383d8) | |
| [options.alwaysOnTop] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice will be on top of all other UI elements, i set with a valid boolean value it will override the module setting 'Always on top' | |
| [options.chain] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice will call other choices. Default is false. |
| [options.choices] | <code>Choice[]</code> | OPTIONAL: A array of choice child, every child is a button on the choice dialog | |
| [options.textFontSize] | <code>string</code> | OPTIONAL: The text font size on the summary panel. Default is "large" ||
| [options.displayChat] | <code>boolean</code> | OPTIONAL: Create a chat message when you click on a choice child. Default is true ||


TODO

| [options.dictionaryChoices] | <code>Record&lt;string, Choice&gt;</code> | PRIVATE: The internal dictionary used for the chain mechanism |

**Example basic**:

```javascript

game.modules.get('choices-plus').api.showChoices(
{
    title: "Title of the choice",
    text: "Summary text of the Choice",
    choices: [
        {
            text: "Go to the scene 1"
            scene: "Scene.duidg9et345"
        },
        {
            text: "Go to the scene 2"
            scene: "Scene.duidg9et355"
        },
        {
            text: "Go to the scene 3"
            scene: "Scene.duidg9et365"
        }
    ]
});

```

**Example full with some default value**:

```javascript

game.modules.get('choices-plus').api.showChoices(
{
    title: "Title of the choice",
    text: "Summary text of the Choice"
    multi: false,
    time: null,
    img: null,
    show: true,
    player: null,
    democracy: false,
    default: 0,
    displayResult: true,
    resolveGM: false,
    portraits: ["Arngrim Brakenbrik","Blue Dragon Wyrmling","Acolyte"],
    textColor: "#000000eb",
    textFontSize: "large",
    displayChat: true,
    backgroundColor: "#000000ff",
    buttonColor: "#ffffffd8",
    buttonHoverColor: "#c8c8c8d8",
    buttonActiveColor: "#838383d8",
    alwaysOnTop: null,
    choices: [
        {
            text: "Go to the scene 1"
            scene: "Scene.duidg9et345"
        },
        {
            text: "Go to the scene 2"
            scene: "Scene.duidg9et355"
        },
        {
            text: "Go to the scene 3"
            scene: "Scene.duidg9et365"
        }
    ]
});

```




**Example of a simple choice option**

```javascript

{
    title: "Title of the choice",
    text: "Summary text of the Choice"
    multi: false,
    time: null,
    img: null,
    show: true,
    player: null,
    democracy: false,
    default: 0,
    displayResult: true,
    resolveGM: false,
    portraits: ["Arngrim Brakenbrik","Blue Dragon Wyrmling","Acolyte"],
    textColor: "#000000eb",
    textFontSize: "large",
    displayChat: true,
    backgroundColor: "#000000ff",
    buttonColor: "#ffffffd8",
    buttonHoverColor: "#c8c8c8d8",
    buttonActiveColor: "#838383d8",
    alwaysOnTop: null,
    chain: true,
    choices: [
        {
            text: "Go to the scene 1"
            scene: "Scene.duidg9et345"
            sound: null // OPTIONAL
            macro: null,  // OPTIONAL
            chain: null,  // OPTIONAL
            backgroundColor: null, // OPTIONAL
            backgroundImage: null, // OPTIONAL
            disable: false, // OPTIONAL
            portraits: [], // OPTIONAL
        },
        {
            text: "Go to the scene 2"
            scene: "Scene.duidg9et355"
            sound: null // OPTIONAL
            macro: null,  // OPTIONAL
            chain: null,  // OPTIONAL
            backgroundColor: null, // OPTIONAL
            backgroundImage: null, // OPTIONAL
            disable: false, // OPTIONAL
            portraits: [], // OPTIONAL
        },
        {
            text: "Go to the scene 3"
            scene: "Scene.duidg9et365"
            sound: null // OPTIONAL
            macro: null,  // OPTIONAL
            chain: null,  // OPTIONAL
            backgroundColor: null, // OPTIONAL
            backgroundImage: null, // OPTIONAL
            disable: false, // OPTIONAL
            portraits: [], // OPTIONAL
        }
    ]
}

```
