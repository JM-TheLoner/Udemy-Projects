import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/Agent"
import  {idlFactory} from '../../../declarations/nft'
import { Principal } from '@dfinity/Principal'
import Button from './Button'
import { opend } from '../../../declarations/opend'
import  {idlFactory as tokenIDLFactory} from '../../../declarations/token'                //to avoid confusion with the previous one
import CURRENT_USER_ID from '../index'
import Pricelabel from './Pricelabel'

function Item(props) {

  const [name, setname] = useState('')
  const [userId, setuserId] = useState('')
  const [image, setimage] = useState('')
  const [button, setbutton] = useState('')
  const [inputer, setinputer] = useState('')
  const [sellStatus, setsellStatus] = useState('')
  const [priceLabel, setpriceLabel] = useState('')
  const [loaderHidden, setLoaderHidden] = useState(true)
  const [shouldDisplay, setshouldDisplay] = useState(true)
  const [blur, setblur] = useState()
  
  const id = props.id

  const localhost = "http://localhost:8080/"

  const agent = new HttpAgent({
    host: localhost
  })

  agent.fetchRootKey()                                          //remove this when deploying live

  let NFTActor

  async function loadNFT() {
    NFTActor = await Actor.createActor( idlFactory, {
      agent,
      canisterId: Principal.fromText(id)
    })

  const name = await NFTActor.getName()
  setname(name)

  const id = await NFTActor.getOwner()
  setuserId(Principal.toText(id))

  const img = await NFTActor.getAsset()                                                 //returns an 8bit array ([Nat8])
  const imgContent = new Uint8Array(img)                                                //convert it to uint8 array
  const image = URL.createObjectURL(new Blob([imgContent.buffer], {type: "image/png"}))

  setimage(image)


  if (props.role === "collection"){
    const nftIsListed = await opend.isListed(props.id)

    if (nftIsListed){
      setblur({
        filter:"blur(4px)"
      })    
      setuserId("OpenD") 
      setsellStatus(': Listed') 
    } else {
      setbutton(<Button handleClick={handleSell} text={'Sell'}/>)
    }    
  } else if (props.role==="discover"){
    const originalOwner = await opend.getOriginalOwner(props.id)

    if (originalOwner.toText() != CURRENT_USER_ID.toText()){
      setbutton(<Button handleClick={handleBuy} text={'Buy'}/>)
    }

    const listingprice = await opend.getPrice(props.id)

    setpriceLabel(<Pricelabel price={listingprice.toString()}/>)                            //to string because that is what the span that is displaying it is looking for

    
  }

  }

  let price
  function handleSell () {
    setinputer(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e)=>{ price = e.target.value}}
      />)
    
    setbutton(<Button handleClick={sellItem} text={'Confirm'}/>)

  }
  async function handleBuy () {
    setLoaderHidden(false)
    console.log("Bought");
    const tokenActor = await Actor.createActor( tokenIDLFactory, {
      agent,
      canisterId: Principal.fromText("<token id>")                                                        //dfx canister id token
    })

    const sellerID = await opend.getOriginalOwner(props.id)                                                     //from before
    const price = await opend.getPrice(props.id)                                                                //from before

    const result = await tokenActor.transfer(sellerID, price)                                                   //transfer function from token. price is added to the seller's balance and subtracted from the buyer's balance

    if (result === "Success"){
      //Transfer ownership of nft
      const purchaseResult = await opend.completePurchase(props.id, sellerID, CURRENT_USER_ID)
      console.log(purchaseResult);
      setLoaderHidden(true)
      setshouldDisplay(false)
    }
  }

  async function sellItem(){
    setblur({
      filter:"blur(4px)"
    })
    setLoaderHidden(false)
    const result = await opend.listItem(props.id, Number(price))                        //convert price to a number
    console.log(result);
    if (result === "Success"){
      const openDId = await opend.getOpendCanisterId()
      const transferResult = await NFTActor.transferOwnership(openDId)

      if (transferResult == "Success");{
        setLoaderHidden(true)
        setbutton()                                                                     //to make the button and the input disappear after listing for sale
        setinputer()                                                                    //because you no longer have the right to sell them 
        setuserId("OpenD")                                                              //to make the owner show as OpenD 
        setsellStatus(': Listed')
      }      
    }
  }

  useEffect(()=>{
    loadNFT()
  }, [])

  return (
    <div style={{display: shouldDisplay ? 'inline' : 'none'}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {userId}
          </p>
          {inputer}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
