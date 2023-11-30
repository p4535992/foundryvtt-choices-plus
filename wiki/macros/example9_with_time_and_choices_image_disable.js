game.modules.get("choices-plus").api.showChoices({
  title: "Example 7 with time and choices image",
  text: "<p>This is a html code.</p>",
  time: 30,
  img: "https://i.pinimg.com/originals/f4/30/56/f43056ea6e34f2071621a736b6d6da36.jpg",
  choices: [
    {
      scene: "Scene Choice 1",
      text: "Go to the scene 'Scene Choice 1'",
      backgroundImage: "https://i.imgur.com/ZOY8OLS.png",
    },
    {
      scene: "Scene Choice 2",
      text: "Go to the scene 'Scene Choice 2'",
      backgroundImage: "https://i.imgur.com/oQBQnNy.png",
    },
    {
      scene: "Scene Choice 3",
      text: "Go to the scene 'Scene Choice 3'",
      backgroundImage: "https://i.imgur.com/gFrhSc8.png",
      disable: true,
    },
  ],
});
