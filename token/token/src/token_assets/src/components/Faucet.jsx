import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token"
import { AuthClient } from '@dfinity/auth-client'

function Faucet(props) {

  const [dis, setdis] = useState(false)
  const [text, settext] = useState('Gimme Gimme')

  async function handleClick(event) {
    setdis(true)                                                                                    //so it can happen once per account

    const authClient = await AuthClient.create()
    const identity  = await authClient.getIdentity()

    const authCanister = createActor(canisterId, {
      agentOptions:{
        identity,
      },
    })

    const result = await authCanister.payOut()
    event.preventDefault()
    settext(result)
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DAngela tokens here! Claim 10,000 DANG coins to your {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disable={dis}>
          {text}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
