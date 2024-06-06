game.modules.get("choices-plus").api.showChoices({
    title: "A dream...or something else?",
    text: "<p>Something has been haunting your sleep. Flickers of dreams..or visions, perhaps? A porcelain mask of an eerie face, one that looked familiar and strange, with a dueling scar bisecting one eye hole. Long corridors of twisting stones: solid one moment, then thin and gossamer as rising smoke the next. A room with five pedestals around a rotating dais. A tangled forest of thorny brush, twitching and pulsing like the veins in your neck. A shudder in your skull that you realize is a heartbeat, or perhaps laughter.</p>",
    democracy: true,
    resolveGM: true,
    time: 30,
    textColor: "#ffffffd8",
    img: "https://i.pinimg.com/564x/9e/40/f0/9e40f02f39ebc33651cf18d652e6d688.jpg",
    choices: [
        {
            text: "...",
            backgroundImage: "https://i.pinimg.com/originals/59/16/0b/59160b7e8609cd780cb8bed5fdb898c4.png",
            macro: "Dream2",
            chain: true,
        },
    ],
});
