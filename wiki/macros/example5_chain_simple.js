game.modules.get("choices-plus").api.showChoices({
    title: "Example 5 with simple chain",
    text: "<p>This is a html code.</p>",
    img: "https://i.pinimg.com/originals/f4/30/56/f43056ea6e34f2071621a736b6d6da36.jpg",
    democracy: true,
    resolveGM: true,
    choices: [
        {
            title: "Go to the scene 'Scene Choice 1'",
            text: "Go to the scene 'Scene Choice 1'",
            macro: "Choices 1 - Example with time",
            chain: true,
        },
        {
            title: "Go to the scene 'Scene Choice 2'",
            text: "Go to the scene 'Scene Choice 2'",
            macro: "Choices 2 - Example with multi",
            chain: true,
        },
        {
            title: "Go to the scene 'Scene Choice 3'",
            text: "Go to the scene 'Scene Choice 3'",
            macro: "Choices 3 - Example with no democracy",
            chain: true,
        },
    ],
});
