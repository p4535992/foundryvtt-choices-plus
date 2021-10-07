class VisualNovelDialog {
  constructor(content) {
    this.content = content;
    this.getDefaults();
    this.parseData();
    const choicesContainer = $(`<div class="choices-container"></div>`);
    this.element = $(`<div id="choices-dialog"></div>`);
    this.element.append(choicesContainer);
    this.contenainer = choicesContainer;
    if(game.user.isGM) this.addGMButtons();
    game.VisualNovelDialog = this;
  }

    addGMButtons() {
        const gmButtons = $(`<div class="gm-buttons"></div>`);
        const resolveButton = $(`<button class="gm-button">Resolve</button>`);
        const closeButton = $(`<button class="gm-button">Close</button>`);
        gmButtons.append(resolveButton);
        gmButtons.append(closeButton);
        this.element.append(gmButtons);
        resolveButton.click(() => ChoicesSocket.executeForEveryone("resolve"));
        closeButton.click(() => ChoicesSocket.executeForEveryone("cancel"));

    }

  parseData() {
    //splt the content by lines
    this.lines = this.content.split("\n");
    //remove empty lines
    this.lines = this.lines.filter((line) => line.length > 0);
    //store first line as the title
    this.title = this.processLine(this.lines[0]);
    for (let [k, v] of Object.entries(this.title)) {
      this[k] = v;
    }
    //remove the title from the lines
    this.lines.shift();
    //store the lines as the choices
    this.choices = this.lines;
    //process the choices
    this.choices = this.choices.map((choice) => this.processLine(choice));
    delete this.title;
    delete this.lines;
    console.log(this);
  }

  processLine(line) {
    //match all text between square brackets
    let matches = line.match(/\[(.*?)\]/g);
    //if there are no matches, return the line
    if (matches === null) {
      return line;
    }
    //store all non matching text as the content
    let content = line.replace(/\[(.*?)\]/g, "");
    //remove leading and trailing whitespace
    content = content.trim();
    let result = {
      content: content,
    };
    //loop through all matches
    for (let match of matches) {
      //remove the square brackets
      match = match.replace(/\[|\]/g, "");
      //split the match by the equals sign
      let parts = match.split("=");
      //store the first part as the key
      let key = parts[0].toLowerCase();
      //store the second part as the value
      let value = parts[1];
      //add the key and value to the result
      result[key] = value;
    }
    return result;
  }

  startTimer() {}

  updateChoices(userId, choicesIndexes) {
    const user = game.users.get(userId);
    const img = user.character.data.img;
    this.choices.forEach((choice, index) => {
      choice.element
        .find(".choice-chosen")
        .find(`[data-userid=${userId}]`)
        .remove();
      if (choicesIndexes.includes(index)) {
        choice.element
          .find(".choice-chosen")
          .append(`<img src=${img} data-userid=${userId}>`);
      }
      if (choice.element.find("img").length > 0) {
        choice.element.find(".choice-chosen").show();
      } else {
        choice.element.find(".choice-chosen").hide();
      }
    });
  }

  render() {
    const _this = this;
    //create the title element
    let title = $(`<h1>${this.content}</h1>`);
    //create the choices element
    let choices = $(`<div id="choices"></div>`);
    //setup timer
    if (this.time) {
      let timer = $(`<div id="timer">${this.time}</div>`);
      this.timer = timer;
      this.contenainer.append(timer);
      this.startTimer();
    }
    if (this.img) {
      let img = $(`<img class="choices-bg" src="${this.img}">`);
      this.contenainer.append(img);
    }
    //loop through all the choices
    for (let choice of this.choices) {
      //create a choice element
      let choiceElement = $(
        `<div class="choice"><div class="choice-chosen"></div><div class="choice-text">${choice.content}</div></div>`
      );
      //add the choice element to the choices element
      choices.append(choiceElement);
      choiceElement.find(".choice-chosen").hide();
      choice.element = choiceElement;
    }
    //add the title and choices element to the dialog element
    this.contenainer.append(title);
    this.contenainer.append(choices);
    //add the dialog element to the body
    $("body").append(this.element);
    //setup the click event for the choices
    this.choices.forEach((choice) => {
      choice.element.click((e) => {
        const isSelected = $(e.currentTarget).hasClass("choice-active");
        if (!_this.multi) {
          _this.choices.forEach((choice) =>
            choice.element.removeClass("choice-active")
          );
        }
        $(e.currentTarget).toggleClass("choice-active", isSelected);
        $(e.currentTarget).toggleClass("choice-active");
        if (!_this.show) return;
        let chosenIndex = [];
        _this.choices.forEach((choice, index) => {
          if (choice.element.hasClass("choice-active")) {
            chosenIndex.push(index);
          }
        });
        ChoicesSocket.executeForEveryone(
          "sendChoice",
          game.user.id,
          chosenIndex
        );
      });
    });
  }

  getDefaults() {
    this.multi = false;
    this.time = null;
    this.img = null;
    this.show = true;
    this.player = null;
    this.democracy = true;
    this.default = 0;
    this.displayResult = true;
  }

  resolveVote() {
    let choice = this.choices[this.default];
    if (this.democracy) {
      //find the choice with the highest number of votes
      let max = 0;
      this.choices.forEach((c, index) => {
        const votes = c.element.find("img").length;
        if (votes > max) {
          max = votes;
          choice = c;
        }
      });
    } else {
      //find the choice made by the user
      const userId = game.user.id;
      this.choices.forEach((c, index) => {
        if (c.element.find(`[data-userid=${userId}]`).length > 0) {
            choice = c;
        }
      });
    }
    if(choice){
        this.resolve(choice);
    }else{
        this.resolveNull();
    }
    this.close();
  }

  resolve(choice) {}

  resolveNull() {}

  close() {
    game.VisualNovelDialog = null;
    this.element.remove();
  }

  cancelVote() {
    this.close();
  }
}
