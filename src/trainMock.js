const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['en'],
      }
    },
    use: ['Basic', 'LangEn'],
  });

  const manager = dock.get('nlp');

  // Adds the utterances and intents for the NLP
  manager.addDocument('en', 'goodbye for now', 'greetings.bye');
  manager.addDocument('en', 'bye bye take care', 'greetings.bye');
  manager.addDocument('en', 'okay see you later', 'greetings.bye');
  manager.addDocument('en', 'bye for now', 'greetings.bye');
  manager.addDocument('en', 'i must go', 'greetings.bye');
  manager.addDocument('en', 'hello', 'greetings.hello');
  manager.addDocument('en', 'hi', 'greetings.hello');
  manager.addDocument('en', 'howdy', 'greetings.hello');
  
  // Train also the NLG
  manager.addAnswer('en', 'greetings.bye', 'Till next time');
  manager.addAnswer('en', 'greetings.bye', 'see you soon!');
  manager.addAnswer('en', 'greetings.hello', 'Hey there!');
  manager.addAnswer('en', 'greetings.hello', 'Greetings!');

  // Train the network
  await manager.train();

  // Export model (to model.nlp, presumably)
  //const minified = true;
  //const data = manager.export(minified);
  manager.save("./build/modelMock.nlp")

  //const response = await nlp.process('en', 'I should go now');
  //console.log(response);
})();

