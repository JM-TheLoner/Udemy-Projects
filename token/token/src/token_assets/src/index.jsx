import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client'

const init = async () => { 

  const authClient = await AuthClient.create()

  if (await authClient.isAuthenticated()){                                              //each liginlasts about 8 days
    handleAuth(authClient)
  } else {
      await authClient.login({
        identityProvider: 'https://infinity.ic0.app/#authorize',                             //And the identityProvider in this case is going to be a URL that points to the identity service on the Internet Computer, which is basically going to provide the frontend for our login purposes so that we don't have to create it ourselves.
        onSuccess: ()=>{ handleAuth(authClient) }
      })   
  }

  async function handleAuth(authClient) {
    const identity = await authClient.getIdentity()
    const userPrincipal = identity._principal.toString()
    ReactDOM.render(<App loggedinPrincipal={userPrincipal}/>, document.getElementById("root"));
  }
}

init();


