const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const accountID = '0xb63b749c731e3647B1c0C1A2B04C5a927eB9aA3f';

// contractAddress and abi are setted after contract deploy
var contractAddress = '0x75E1862080E87f3e56a0e26A9d8D12416afA951a';
const providerUrl = 'http://localhost:7545';
const smartContractAbi = fs.readFileSync('/Users/alfonso/Documents/TFM/BACK/consents/contractsEth/contractsTFM.json', 'utf8');

var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
var abi = JSON.parse(smartContractAbi);

//contract instance
contract = new web3.eth.Contract(abi, contractAddress);


    // Accounts
    var account;

    web3.eth.getAccounts(function(err, accounts) {
    if (err != null) {
        console.log("Error retrieving accounts.");
        return;
    }
    if (accounts.length == 0) {
        alert("No account found! Make sure the Ethereum client is configured properly.");
        return;
    }

    account = accounts[0];
    //fijamos a la definida en la constante
    //account = accountID;
    console.log('Account: ' + account);
    web3.eth.defaultAccount = account;
    });


   //Testing Ethereum smart contract
  function registerSetDataTest (texto) {
    contract.methods.setDataTEST (texto).send( {from: account}).then( function(tx) { 
      console.log("Transaction: ", tx); 
    });
  }
  //Register a transaction in Ethereum with: information about consents webform and data of user.
  function registerContractTFM(textContract,idContract, username, acceptContract, deadlineDate) {
     contract.methods.issueContractTFM (textContract, idContract, username, acceptContract, deadlineDate).send( {from: account}).then( function(tx) { 
       console.log("Transaction: ", tx); 
     });
   }

  //Obtain data of information register in Ethereum (for example throught registerContractTFM method)  
   function getContractSignedTFM2() {
    contract.methods.getContractSignedTFM.call().then( function( info ) { 
      console.log("info: ", info);
      
    });    
  }

   async function getContractSignedTFM() {
    const data = await contract.methods.getContractSignedTFM().call();
    //@TODO
   }


  module.exports.registerSetDataTest = registerSetDataTest;
  module.exports.registerContractTFM = registerContractTFM;
  module.exports.getContractSignedTFM = getContractSignedTFM;


