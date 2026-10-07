import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Item from "./Item"
import Minter from "./Minter";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "../../assets/home-img.png";

function App() {

  // const ID = '<canister id>'

  return (
    <div className="App">
      <Header />
      <Item id={ID}/>
      <Minter />
      <Footer />
    </div>
  );
}

export default App;
