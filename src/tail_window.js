// Prepare the nlp manager at loading time
(async () => {

    // Initialize nlpjs objects
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);
    const manager = container.get('nlp');

    // Get data from URL (gist)
    let response = await fetch(modelUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.text();
    
    // Import the model into manager
    await manager.import(data);

    window.nlpManager = manager;
    window.ask = ask;
    window.buildAPIParams = buildAPIParams;
    window.buildAnswer = buildAnswer;
})();

