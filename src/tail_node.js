function AtlasApproxNlp(context = {}) {
  this.initialised = false;
  this.context = context;
}

AtlasApproxNlp.prototype = {
  async initialise() {
    if (this.initialised == true)
      return this;

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

    this.nlpManager = manager;
    this.ask = ask.bind(this);

    this.initialised = true;

    return this;
  },

  reset() {
    this.context = {};
    return this;
  }
}


module.exports = {
  AtlasApproxNlp,
  buildAPIParams,
  buildAnswer,
}
