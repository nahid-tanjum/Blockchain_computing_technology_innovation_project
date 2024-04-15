const express = require('express');
const cors = require('cors');
const Web3 = require('web3');

const app = express();
const PORT = 3000;

app.use(cors());


const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3(provider);
console.log(web3.isConnected());


// Adjust the port if your Ganache runs on a different one

// Corrected ABI definition
const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "method",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "Count",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "increase",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decrease",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];

const contractAddress = '0xc33D7DdB523067b0Bd8142ff0CE9133426Ed581D'; 
const contract = new web3.eth.Contract(ABI, contractAddress);

app.get('/contractData', async (req, res) => {
    try {
      const currentCount = await contract.methods.getCount().call();
      // replace 'someMethod' with an appropriate method from your contract or remove if not applicable
        const blockNumber = await web3.eth.getBlockNumber();
        const block = await web3.eth.getBlock(blockNumber);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // or select the relevant account
        const balanceWei = await web3.eth.getBalance(account);
        const balance = web3.utils.fromWei(balanceWei, 'ether');
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = block.gasLimit;
        
        // Fetch any other required data you need from your contract...

        res.json({
            currentCount,
            contractAddress,
            blockNumber,
            blockTimestamp: block.timestamp,
            account,
            balance,
            gasPrice,
            gasLimit
            // ... add other data you wish to send here
        });
    } catch (error) {
        console.error("Error fetching contract data: ", error);
        res.status(500).send('Error fetching contract data.');
    }
});
app.listen(PORT, (err) => {
  if (err) {
      console.error('Failed to start the server:', err);
      return;
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
