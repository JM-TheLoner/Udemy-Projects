import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import Minter from './Minter'
import Gallery from './Gallery'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { Opend } from '../../../declarations/opend'
import CURRENT_USER_ID from '../index'

function Header() {

  const [userNFTsList, setUserNftsList] = useState()
  const [listedNFTsList, setListedNftsList] = useState()


  async function getNfts() {
    const userNFTs = await opend.getOwnedNFTs(CURRENT_USER_ID)
    setUserNftsList(<Gallery title='My NFTs' role="collection" nfts={userNFTs}/>)

    const listed = await opend.getListedNFTs()
    setListedNftsList(<Gallery title='Discover' role="discover" nfts={listed}/>)
  }

  useEffect(()=>{
    getNfts()
  }, [])

  return (

    <BrowserRouter forceRefresh={true}>                                                                         //refreshes the header meaning the useEffect gewts called so usernfts updates and rerenders after minting new NFTs

    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>

          <Route exact path='/'>
            <h5 className="Typography-root header-logo-text">OpenD</h5>
          </Route>
          
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to='/discover'>
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to='/minter'>
              Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to='/collection'>
              My NFTs
            </Link>
          </button>
        </div>
      </header>
    </div>
    <Switch>
      <Route exact path='/'>
        <img className="bottom-space" src={homeImage} />
      </Route>
      <Route path='/discover'>
        {listedNFTsList}
      </Route>
      <Route path='/minter'>
        <Minter/>
      </Route>
      <Route path='/collection'>
        {userNFTsList}
      </Route>
    </Switch>

    </BrowserRouter>
  );
}

export default Header;
