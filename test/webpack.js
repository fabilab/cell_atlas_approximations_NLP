let nlpInitialize = require('./atlasapprox-nlp.js');

(async () => {
  let nlp = await nlpInitialize();
  window.nlp = nlp;
  console.log("Module loaded");
})();
