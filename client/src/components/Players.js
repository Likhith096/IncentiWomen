import React, {useState,useEffect} from 'react';
import "./Players.css"

const Players = ({state, address}) => {
    const [account,setAccount] = useState("No account connected");
    const [registeredPlayers, setRegisteredPlayers] = useState([]);

    useEffect(() => {
        const getAccount = async () => {
          try {
            const { web3 } = state;
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
          } catch (error) {
            console.error('Error fetching accounts:', error);
          }
        };
      
        getAccount(); // Call the async function immediately
      }, [state]);

      useEffect(()=>{
        const getPlayers = async () => {
            try {
              if (!state || !state.contract) {
                console.error('Contract is not initialized');
                return;
              }
              const players = await state.contract.methods.allPlayers().call();
              setRegisteredPlayers(players); // Assuming `players` is an array of player addresses or IDs
            } catch (error) {
              console.error('Error fetching players:', error);
            }
          };
          
        getPlayers();
      }, [state])


  return (
    <div className="play-container">
      <div className="play-box">
        <p className='acc'>Connected Account: {account}</p>
        <p>Players pay 1 ether on this contract address: {address}</p>
        <div className="players"><p>Registered Players</p>
          {registeredPlayers.length !== 0 && registeredPlayers.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Players
