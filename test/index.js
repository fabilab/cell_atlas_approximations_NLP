const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');

(async () => {
    
    // Get data from URL (gist)
    const modelMockUrl = "https://gist.githubusercontent.com/iosonofabio/44f816c3ad8b82c3ccc1ba7b56906c4a/raw/e8e5bcba579ff3355923435fd88a0b62bda975ae/model.nlp";
    const modelUrl = "https://gist.githubusercontent.com/iosonofabio/c42d91f7297c949eff0168078940af2d/raw/cfc0e0cbc6265b09ef91cd06afa802e03fd7c344/model.nlp";
    const response = await fetch(modelUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.text();

    // Ok, got the data
    //console.log(data);
    
    // Prepare nlp library
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');
    await manager.import(data);

    // Use the model
    const answer = await manager.process('en', 'I should go now');

    // Report the result
    console.log(answer);

    window.answerFun = function(question) { return manager.process("en", question) };

})();
