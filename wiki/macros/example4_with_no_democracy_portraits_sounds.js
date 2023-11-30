game.modules.get("choices").api.showChoices(
    {
        title: "Example 4 with no democracy, portraits and sounds", 
        text: "<p>This is a html code.</p>",
        democracy: false,
        portraits: "Arngrim Brakenbrik,Blue Dragon Wyrmling,Acolyte",
        img: "https://i.pinimg.com/564x/49/92/5e/49925e1c7ff5dae26836ec636b134a1e.jpg",
        choices: [
            {
                scene: "Scene Choice 1",
                text: "Go to the scene 'Scene Choice 1'",
                sound:"music/Bloodborne/02.%20Ryan%20Amon%20-%20The%20Night%20Unfurls.mp3",
            },
            {
                scene: "Scene Choice 2",
                text: "Go to the scene 'Scene Choice 2'",
                sound:"music/Bloodborne/02.%20Ryan%20Amon%20-%20The%20Night%20Unfurls.mp3",
            },
            {
                scene: "Scene Choice 3",
                text: "Go to the scene 'Scene Choice 3'",
                sound:"music/Bloodborne/02.%20Ryan%20Amon%20-%20The%20Night%20Unfurls.mp3",
            }
        ]
    }
)