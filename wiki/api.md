The api is reachable from the variable `game.modules.get('choices').api` or from the socket libary `socketLib` on the variable `game.modules.get('choices').socket` if present and active.

You can find some javascript examples here [macros](./macros/)

#### showChoices({options}):void ⇒ <code>Promise&lt;void&gt;</code>

**Note on chaining IF YOU USE THE CHAT OPTION :** If you want to chain choices, the choice needs to have `democracy=true` and `resolveGM=true`, any option that calls another choice needs to have `chain=true`

**Note on chaining IF YOU USE THE API OPTION :** If you want to chain choices, the choice needs to have and, any option that calls another choice needs to have `chain=true`, `resolveGM=true` and a reference to the other choice macro `macro=xxx`

**Note on the execution of the macro:** executes Macro command, giving speaker, actor, token, character, and event constants. This is recognized as the macro itself. Pass an event as the first argument. Is the same concept used from [Item Macro](https://github.com/Foundry-Workshop/Item-Macro/), but without the item, also the main reference is not the item, but the actor, we used the actor set as character by default or the first owned actor by the user, same concept of [Item Piles](https://github.com/fantasycalendar/FoundryVTT-ItemPiles)

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| options | `object` | | The options to pass to the function 
| [options.title] | <code>string</code> | The big title for the choice | |
| [options.text] | <code>string</code> | The little (and short), summary text for the choice | NOTE: You can use html core and document link on this text |
| [options.multi] | <code>boolean</code> | OPTIONAL: true or false, determines if multiple choices can be selected (default false) | |
| [options.time] | <code>number</code> | OPTIONAL: The number of seconds for make a decision (default 0) | |
| [options.img] | <code>string</code> | OPTIONAL: the path to the image to be displayed as the background (default null) | |
| [options.show] | <code>boolean</code> | OPTIONAL: true or false, determines if show the active choice | Working in progress for a better behavior |
| [options.player] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of player names, if not provided all players will get to chose | NOTE: You can use user name, or id or uuid associated to a user |
| [options.democracy] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice with the highest votes will be picked (if true) or resolve the choice per player (if false) (default true) | |
| [options.default] | <code>number</code> | OPTIONAL: the default choice if no choice is made (default 0 the first choice on the list) | Working in progress for a better behavior |
| [options.displayResult] | <code>boolean</code> | OPTIONAL: true or false, determine if the result will be output to chat after the choice is made (default true) | |
| [options.resolveGM] | <code>boolean</code> | OPTIONAL: true or false, determine if the resolution of the choice should run on the gm side as well (default false) | |
| [options.portraits] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of actor names, if not provided no portrait is show | NOTE: You can use actor name, or id or uuid associated to a actor |
| [options.textColor] | <code>string</code> | OPTIONAL: apply a text color as css on the choice (default #000000eb) | |
| [options.backgroundColor] | <code>string</code> | OPTIONAL: apply a background color as css on the choice (default #000000ff) | |
| [options.buttonColor] | <code>string</code> | OPTIONAL: apply a button color as css on the choice (default #ffffffd8) | |
| [options.buttonHoverColor] | <code>string</code> | OPTIONAL: apply a button color as css when hover on the choice (default  #c8c8c8d8)| |
| [options.buttonActiveColor] | <code>string</code> | OPTIONAL: apply a button color as css when set active on the choice (default #838383d8) | |
| [options.alwaysOnTop] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice will be on top of all other UI elements, i set with a valid boolean value it will override the module setting 'Always on top' | |
| [options.choices] | <code>ChoiceChild[]</code> | A array of choice child, every child is a button on the choice dialog | |

**Example basic**:

```javascript

game.modules.get('choices').api.showChoices(
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

game.modules.get('choices').api.showChoices(
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

### Choice child Model

**NOTE:** Every choice options can be triggered with the name or the id or the uuid of the document (scene, actor, sound, ecc.)the priority for check is by default uuid -> id -> name.

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| options | `object` | | The options to pass to the function of the child choice
| [options.text] | <code>string</code> | The text to show on the button | |
| [options.scene] | <code>string</code> | OPTIONAL: a scene name or id, or uuid, when the choice is resolved this scene will be viewed. | This choice option can be triggered with the name or the id or the uuid the priority for check is anyway uuid -> id -> name. |
| [options.sound] | <code>string</code> | OPTIONAL: usually a sound file path, but i can be the PlaySound name or id or uuid, when the choice is resolved this sound will be played once | This choice option can be triggered with the name or the id or the uuid the priority for check is anyway uuid -> id -> name. |
| [options.macro] | <code>string</code> | a macro name or id or uuid, when the choice is resolved this macro will be executed, if you have the advanced macros module you can provide a comma separated list of args to be passed to the macro (eg [macro=myMacro,arg0,arg1]). | This choice option can be triggered with the name or the id or the uuid the priority for check is anyway uuid -> id -> name. |
| [options.chain] | <code>boolean</code> | OPTIONAL: set to true if this options triggers a macro with a choice. Remember if you want to chain choices, the choice needs to have `macro=xxx` and `resolveGM=true` (default false) | This choice option can be triggered with the name or the id or the uuid the priority for check is anyway uuid -> id -> name. |
| [options.backgroundColor] | <code>string</code> | OPTIONAL: This is the background color to apply to the choice button | This will override the options 'backgroundColor'|
| [options.backgroundImage] | <code>string</code> | OPTIONAL: This is the background image to apply to the choice button | |
| [options.disable] | <code>boolean</code> | OPTIONAL: For some reason you want to see to choice, but it cannot be selected (also a big red cross appear on this option just to make it clear) | |


**Example of a simple choice option**

```javascript
{
    text: "Go to the scene"
    scene: "Scene.duidg9et345",  // OPTIONAL
    sound: null // OPTIONAL
    macro: null,  // OPTIONAL
    chain: false  // OPTIONAL
    backgroundColor: null, // OPTIONAL
    backgroundImage: null, // OPTIONAL
    disable: false, // OPTIONAL
}

```

**Example of a choice option chained to other**


```javascript
{
    text: "Go to the scene",
    macro: "Macro.duidg9et345",
    resolveGM: true,
    chain: false
}

```