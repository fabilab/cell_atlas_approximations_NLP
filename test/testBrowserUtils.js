// Shortcut function to the API
async function callAPI(endpoint, params = {}) {
    // Phrase https request from params (they are all GET for now, so URI encoding suffices)
    let uri = "https://api.atlasapprox.org/v1/" + endpoint

    const uriSuffix = new URLSearchParams(params).toString();
    if (uriSuffix != "")
        uri += "?" + uriSuffix;

    if (debug)
        console.log("API URI: " + uri)

    let response = await fetch(uri);

    // Check response
    let data;
    if (!response.ok) {
        data = {
            error: "API call failed",
        }
    } else {
        // NOTE: response.body is a stream, so it can be processed only ONCE
        data = await response.json();
    }

    return data;
}


    //if (debug)
    //    console.log("calling API...");

    //// Build API request parameters
    //let { endpoint, params } = buildAPIParams(response.intent, response.entities);

    //// Call API with endpoint and request parameters
    //let data = await callAPI(endpoint, params);

    //// Construct a NL answer from the data. This might be better outsourced to nlpjs.
    //const answer = buildAnswer(response.intent, data);

    //return {
    //    intent: response.intent,
    //    endpoint: endpoint,
    //    params: params,
    //    data: data,
    //    answer: answer,
    //};


    //APIAnswer.complete = true;
    //return APIAnswer;
