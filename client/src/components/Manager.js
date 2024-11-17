import React, {useState,useEffect} from 'react'
import "./Manager.css";

const Manager = ({state}) =>{
  const [account, setAccount] = useState(""); 
  const [cb,setCb] = useState(0);
  const [lWinner,setLWinner] = useState("No winner");
  useEffect(() => {
    const getAccount = async () => {
      if (1) {
        try {
          const { web3 } = state;
          const accounts = await web3.eth.getAccounts(); // Correct function name
          console.log(accounts);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      } else {
        console.warn('state or state.web3 is undefined');
      }
    };
    getAccount();
  }, [state && state.web3]);

  const contBal = async() =>{
    const {contract} = state;
    try{
      const balance = await contract.methods.getBalance().call({from:account});
      setCb(balance);
    }catch(e){
      setCb("You are not manager");
    }
    
  };
  const winner = async () => { 
    const { contract } = state;
    try{
      await contract.methods.pickWinner().send({ from: account });
    const lotterWinner = await contract.methods.winner().call();
    console.log(lotterWinner)
    setLWinner(lotterWinner);
    }catch(e){
      if(e.message.includes("You are not the manager")){
        setLWinner("You are not the manager")
      }else if(e.message.includes("Players are less than 3")){
        setLWinner("Players are less than 3");
      }else{
        setLWinner("No winner yet");
      }
    }
    
  };
  
  return (
    <div className="container">
      <div className='box'>
        <p className='acc'>Connected Account: {account}</p>
        <p>Winner: {lWinner}</p>
        <button onClick={winner} class="btn btn-primary btn-lg">Click to get winner</button><br></br>
        <p><br></br>Contract Balance: {cb}</p>
        <button onClick={contBal} class="btn btn-primary btn-lg">Get Contract Balance</button>
      </div>
    </div>
  )
}

export default Manager
