import dotenv from 'dotenv';
import { ContractTransaction, ethers } from "ethers";
import { GeoMorphs } from "../typechain";
// hh run --network matic scripts/mint-mumbai.ts
// https://explorer-mumbai.maticvigil.com/address/<contract address>
const abi = [
  'function mintTo(address to) public',
]

async function main() {
  dotenv.config();
  const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY || '';
  const URL = 'https://rpc-mumbai.maticvigil.com';
  console.log(`url: ${URL}`);

  const provider = new ethers.providers.JsonRpcProvider(URL);
  const deployer = new ethers.Wallet(MUMBAI_PRIVATE_KEY, provider);
  const deployerAddress = await deployer.getAddress();
  console.log(`deployer address: ${deployerAddress}`);

  const contractAddress = process.env.MUMBAI_CONTRACT_ADDRESS || '';
  const mintToAddress = process.env.MINT_TO_ADDRESS || '';
  console.log(`mintToAddress: ${mintToAddress}`);  

  const contract: GeoMorphs = new ethers.Contract(contractAddress, abi, deployer) as GeoMorphs;

  const receipt: ContractTransaction = await contract.connect(deployer)
    .mintTo(mintToAddress, { gasLimit: 3000000 });

  // receipt should include tokenURI with tokenID
  // here is where you would supply metadata to the above address
  // possibly with a REST post that would create json at that address
  // that would contain a link to the mp4, etc.
  console.log('minted:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });