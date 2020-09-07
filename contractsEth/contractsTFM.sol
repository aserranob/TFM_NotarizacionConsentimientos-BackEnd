pragma solidity ^0.6.9;
pragma experimental ABIEncoderV2;

//"SPDX-License-Identifier: UNLICENSED"
/**
 * @title ContractsTFM
 * @author Alfonso Serrano - <alfonsosb@gmail.com>
 * @dev Simple smart contract which allows register transactions in Ethereum network
 */
contract ContractsTFM {

  /*
  * Enums 
  */
  
  enum ContractsTFMStatus { CREATED, ACCEPTED, CANCELLED }
  /*
  * Storage
  */
  ContratoTFM[] public contratosTFM;

  mapping(uint=>Fulfillment[]) fulfillments;

  /*
  * Structs
*/
  struct ContratoTFM {
      address payable issuer;
      uint deadline;
      string textContract;
      string contractID;
      string user;
      bool acceptContract;
      ContractsTFMStatus status;
      uint amount; //in wei
  }
  
  struct Fulfillment {
      bool accepted;
      address payable fulfiller;
      string data;
  }

  /**
   * @dev Contructor
   */
  constructor() public {}


string data;
function getDataTEST() view external returns(string memory){
	return data;
}
function setDataTEST(string calldata _data) external{
	data = _data;
}

  /**
  * @dev issueBounty(): instantiates a new bounty
  * @param _textContractTFM the unix timestamp after which fulfillments will no longer be accepted
  * @param _idContractTFM the requirements of the bounty
*/

	
 function issueContractTFM(
      string calldata _textContractTFM,
      string calldata _idContractTFM,
      string calldata _username,
      bool _acceptContract,
      uint64 _deadline
  )
      external
      payable
      hasValue()
      validateDeadline(_deadline)
      returns (uint)
  {
      contratosTFM.push(ContratoTFM(msg.sender, _deadline, _textContractTFM, _idContractTFM, _username, _acceptContract, ContractsTFMStatus.CREATED, msg.value));
      emit ContractTFMIssued(contratosTFM.length - 1,msg.sender, msg.value, _textContractTFM);
      return (contratosTFM.length - 1);
  }
  
  function getContractSignedTFM() public view returns (ContratoTFM[] memory) {
        return (contratosTFM);
    }
    
   
  /**
  * Modifiers
  */

  modifier hasValue() {
      require(msg.value > 0);
      _;
  }

  modifier contractTFMExists(uint _contractTFMId){
    require(_contractTFMId < contratosTFM.length);
    _;
  }
  
  modifier fulfillmentExists(uint _contratoTFMId, uint _fulfillmentId){
    require(_fulfillmentId < fulfillments[_contratoTFMId].length);
    _;
  }

  modifier hasStatus(uint _contratoTFMId, ContractsTFMStatus _desiredStatus) {
    require(contratosTFM[_contratoTFMId].status == _desiredStatus);
    _;
  }

  modifier onlyIssuer(uint _contratoTFMId) {
      require(msg.sender == contratosTFM[_contratoTFMId].issuer);
      _;
  }

  modifier notIssuer(uint _contratoTFMId) {
      require(msg.sender != contratosTFM[_contratoTFMId].issuer);
      _;
  }

  modifier fulfillmentNotYetAccepted(uint _contratoTFMId, uint _fulfillmentId) {
    require(fulfillments[_contratoTFMId][_fulfillmentId].accepted == false);
    _;
  }

  modifier validateDeadline(uint _newDeadline) {
      require(_newDeadline > now);
      _;
  }

  modifier isBeforeDeadline(uint _contratoTFMId) {
    require(now < contratosTFM[_contratoTFMId].deadline);
    _;
  }

  /**
  * Events
  */
  event ContractTFMIssued(uint contractTFM_id, address issuer, uint amount, string data);
}
