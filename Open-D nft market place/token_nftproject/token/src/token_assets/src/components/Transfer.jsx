import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token"
import { AuthClient } from '@dfinity/auth-client'
import { Principal } from '@dfinity/principal'  

function Transfer() {

  const [toacc, settoacc] = useState('')
  const [toamt, settoamt] = useState('')
  const [feedback, setfeedback] = useState('')
  const [disable, setdis] = useState(false)
  const [unhidable, setunhid] = useState(false)

   
  async function handleClick() {
    setunhid(false)
    setdis(true)

    const authClient = await AuthClient.create()
    const identity  = await authClient.getIdentity()

    const authCanister = createActor(canisterId, {
      agentOptions:{
        identity,
      },
    })

    const result = await authCanister.transfer(Principal.fromText(toacc), Number(toamt))                 //convert to principal and number

    setfeedback(result)
    setdis(false)
    setunhid(true)
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value = {toacc}
                onChange = {(e)=>{settoacc(e.target.value)}}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value = {toamt}
                onChange = {(e)=>{settoamt(e.target.value)}}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={disable}>
            Transfer
          </button>
        </p>
        {unhidable && <p> {feedback} </p>}
      </div>
    </div>
  );
}

export default Transfer;
