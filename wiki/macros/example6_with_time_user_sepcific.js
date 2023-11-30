game.modules.get("choices-plus").api.showChoices({
  title: "Example 6 with time and user specific",
  text: "<p>This is a html code.</p>",
  time: 30,
  player: ["Player2"],
  img: "https://i.pinimg.com/originals/f4/30/56/f43056ea6e34f2071621a736b6d6da36.jpg",
  choices: [
    {
      scene: "Scene Choice 1",
      text: "Go to the scene 'Scene Choice 1'",
    },
    {
      scene: "Scene Choice 2",
      text: "Go to the scene 'Scene Choice 2'",
    },
    {
      scene: "Scene Choice 3",
      text: "Go to the scene 'Scene Choice 3'",
    },
  ],
});
