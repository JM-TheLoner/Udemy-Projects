import React, { useState } from "react";
import { Principal } from '@dfinity/principal'                                          //importing the datatype
import { token } from "../../../declarations/token"

function Balance() {
  
  const [input, setInput] = useState('')
  const [balance, setBalance] = useState('')
  const [symbol, setsymbol] = useState('')
  const [hide, setHide] = useState(true)
  

  async function handleClick() {
    // console.log("Balance Button Clicked");
    const principal = 
import { Principal } from '@dfinity/principal'  (input)
    const bal = await token.balanceOf(principal)
    setBalance(bal.toLocaleString())

    const sym = await token.getSym()
    setsymbol(sym)

    setHide(false)
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={input}
          onchange={(e)=>{setInput(e.target.value)}}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      {!hide && <p>This account has a balance of {balance} {symbol}</p>}
    </div>
  );
}

export default Balance;
