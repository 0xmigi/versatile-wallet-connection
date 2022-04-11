// import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import { useProvider, useContract, useSigner } from 'wagmi';
import placeholder from '../img/placeholder.png';

import { ethers } from 'ethers';
import lilbrydgeNFTs from '../artifacts/contracts/MyNFT.sol/lilbrydgeNFTs.json';
import { doc } from 'prettier';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";



export const Home = () => {
  
  // get the end user
  const [{ data, error, loading }, getSigner] = useSigner();

  // get the smart contract
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: lilbrydgeNFTs.abi,
    signerOrProvider: data,
  })


  const NFTImage = ({ tokenId, getCount }) => {
    const contentId = 'Qmdbpbpy7fA99UkgusTiLhMWzyd3aETeCFrz7NpYaNi6zY';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
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
      const connection = contract.connect(contract.signerOrProvider);
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
      <div>
        <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
        <div >
          <h5 >ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
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
      <div>
        <div>
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}



export default Home;
