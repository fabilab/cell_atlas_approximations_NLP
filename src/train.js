const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ["en"],
        corpora: [
          "src/corpus.json",
        ],
      }
    },
    use: ["Basic", "LangEn"],
  });

  // Get the nlp manager
  const nlp = dock.get('nlp');

  // Train the neural network
  await nlp.train();

  // Save model (to model.nlp, presumably)
  nlp.save("./gists/model/model.nlp")
})();

