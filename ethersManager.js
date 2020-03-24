const ethers = require('ethers');
const fetch = require('node-fetch');

require('dotenv').config();

const provider = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_PROJECT_ID);

// Quando chiamate, questo metodo ritornerà una promise e dovete settare per forza un catch block
const loadSmartContract = async (contractAddress) => {
  const contractInterface = await getContractInterfaceByAddress(contractAddress);
  const contract = new ethers.Contract(contractAddress, contractInterface, provider);
  return contract;
}

async function getContractInterfaceByAddress(contractAddress) {
  try {
    const etherscanUrl = 'https://api-ropsten.etherscan.io/api';
    const query = `?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await fetch(etherscanUrl + query);
    const respJSON = await response.json();
    return respJSON.result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = {
  loadSmartContract: loadSmartContract,
}

