// import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import { useProvider, useContract, useSigner } from 'wagmi';
import placeholder from '../img/placeholder.png';

import { ethers } from 'ethers';
import lilbrydgeNFTs from '../artifacts/contracts/MyNFT.sol/lilbrydgeNFTs.json';

const contractAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";



export const Home = () => {
  
  // get the end user
  const [{ data }] = useSigner();

  // get the smart contract
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: lilbrydgeNFTs.abi,
    signerOrProvider: data,
  })

  function NFTImage({ tokenId, getCount }) {
    const contentId = 'Qmdbpbpy7fA99UkgusTiLhMWzyd3aETeCFrz7NpYaNi6zY';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  //   const imageURI = `img/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(contract.data);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div style={{ display:'flex', justifyContent:'center', width: '18rem' }}>
        <img style={{ width:'200px'}}  src={isMinted ? imageURI : 'img/placeholder.png'}></img>
        <div className="card-body">
          <h5 className="card-title">ID #{tokenId}</h5>
          {!isMinted ? (
            <button style={{ 
              display:'flex', 
              color:'white', 
              margin:'3px',
              padding:'10px',
              backgroundColor:'grey', 
              justifyContent:'center', 
              width: '11rem',
              border:'none',
              borderRadius:'5px',
            }}
            onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button style={{ 
              display:'flex', 
              color:'white', 
              margin:'3px',
              padding:'10px',
              backgroundColor:'grey', 
              justifyContent:'center', 
              width: '11rem',
              border:'none',
              borderRadius:'5px',
            }}
             onClick={getURI}>
              Taken! Show URI
            </button>
          )}
        </div>
      </div>
    );
  }

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <h1>lilbrydgeNFTs Collection</h1>
      <div style={{width:'100%'}}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 20px',
          marginTop: "5px",
          marginRight: "5px",
          marginLeft: "5px",
        }}>
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} style={{flex:'1 0 0%'}}>
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}



export default Home;
