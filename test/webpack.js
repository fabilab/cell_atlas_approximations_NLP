let { AtlasApproxNlp, buildAPIParams, buildAnswer } = require('./atlasapprox-nlp.js');
let nlp = new AtlasApproxNlp();

(async () => {

  await nlp.initialise();

  window.nlp = nlp;

  console.log("Module loaded");
})();
