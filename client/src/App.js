import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import Lottery from "./contracts/Lottery.json";
import "./App.css";
import Manager from './components/Manager';
import Players from './components/Players';
import Intro from './components/Intro';
import {Route, Link } from "react-router-dom";
import Navbar from './components/Navbar'

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = Lottery.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          Lottery.abi,
          deployedNetwork && deployedNetwork.address
        );
        setAddress(deployedNetwork.address)
        setState({ web3, contract: instance });

      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <div className="App">
      <Navbar></Navbar>
      <Route exact path='/'><Intro></Intro></Route>
      <Route path="/manager">
        <Manager state={state}></Manager>
      </Route>
      
      <Route path="/players">
      <Players state={state} address = {address}></Players>
      </Route>
      
    </div>
  );
};
export default App;
