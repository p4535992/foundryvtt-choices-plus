game.modules.get("choices-plus").api.showChoices({
    title: "Example 2 with multi",
    text: "<p>This is a html code.</p>",
    multi: true,
    img: "https://i.pinimg.com/564x/49/92/5e/49925e1c7ff5dae26836ec636b134a1e.jpg",
    choices: [
        {
            title: "Go to the scene 'Scene Choice 1'",
            scene: "Scene Choice 1",
            text: "Go to the scene 'Scene Choice 1'",
        },
        {
            title: "Go to the scene 'Scene Choice 2'",
            scene: "Scene Choice 2",
            text: "Go to the scene 'Scene Choice 2'",
        },
        {
            title: "Go to the scene 'Scene Choice 3'",
            scene: "Scene Choice 3",
            text: "Go to the scene 'Scene Choice 3'",
        },
    ],
});
