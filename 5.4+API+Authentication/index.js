import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "user";
const yourPassword = "pwd";
const yourAPIKey = "";
const yourBearerToken = "";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.






app.get("/basicAuth", async(req, res) => {
    try {

    axios.post(API_URL + "register", {                                                  //register for access
      username:yourUsername,
      password:yourPassword
    })

    const result = await axios.get(API_URL + "all?page=2", {
      auth: {                                                                           //passing the required data in in auth not header
        username: yourUsername,
        password: yourPassword
      }
    })
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});






app.get("/apiKey", async(req, res) => {
  try {

    yourAPIKey = axios.get((API_URL + "generate-api-key"))                                  //get api key

    const result = await axios.get(API_URL + `filter`, {                                    //or type everything out - (API_URL + "filter?score=5&apiKey=")
      params: {
        score: 5,
        apiKey: yourAPIKey,
      }
    })
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }

  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});






app.get("/bearerToken", async(req, res) => {

  try {

    yourBearerToken = axios.post(API_URL + "register", {                                  //get bearer token
                        username:yourUsername,
                        password:yourPassword
                      })

    const result = await axios.get(API_URL + `secrets/4`, {                  
      headers: {                                                                          //passing the auth in the header
        Authorization: `Bearer ${yourBearerToken}`
      }
    })
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }

  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
