export class ForienEasyPollsHelpers {
  static isFepActive() {
    return game.modules.get("forien-easy-polls")?.active;
  }

  /**
   * Creates a Poll with the given Question and Options (Parts)
   *
   * @param {String} title
   * @param {Choice[]} choices
   * @param {Object} options
   * @param {('multiple'|'single')} [options.multiple=single]
   * @param {boolean} [options.results=false]
   * @param {boolean} [options.secret=true]
   * @return {Promise<abstract.Document>}
   */
  static async createEasyPoolChoice(title, choices, { multiple = "single", results = false, secret = true }) {
    const pollSettings = {
      mode: multiple ? "multiple" : "single", // multiple, single
      results: results, // true or false
      secret: secret, // true or false
    };

    let pool;

    const savedPools = game.modules.get("forien-easy-polls").api.savedPolls();
    for (let [key, value] of savedPools) {
      // TODO The dialog title is enough ?
      if (value.question === title) {
        pool = savedPools.get(key);
        break;
      }
    }
    if (!pool) {
      const question = title;
      const parts = [];
      for (const choice of choices) {
        parts.push(choice.text);
      }

      pool = await game.modules.get("forien-easy-polls").api.createPoll(question, parts, pollSettings);
    }

    return pool;
  }

  /**
   * Answers a specified Poll, by setting a Boolean value on an Answer with provided UserId
   *
   * @param {Pool} poll
   * @param {String} answer
   * @param {boolean} status
   * @param {String} userId
   * @return {Promise<void>}
   */
  static async sendChoice(poll, answer, status, userId) {
    const pollId = poll.id;
    await answerPoll(pollId, answer, status, userId);
  }
}
