pragma solidity ^0.4.0;

//import "./SlotMachineStorage.sol";

library LibInterface {

  function createSlotMachine (address _slotmachineStorage, address _provider,  uint _decider, uint _minBet, uint _maxBet) returns (address);
  function removeSlotMachine (address _slotmachineStorage, address _provider, uint _idx);
  /*function getSlotMachines (address _slotmachineStorage, address _provider, uint _idx) constant returns (address[5]);
  function getNumofSlotMachine (address _slotmachineStorage, address _provider) constant returns (uint);
  function getTotalNumofSlotMachine(address _slotmachineStorage) constant returns (uint);
  function getSlotMachineDecider (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint);
  function getSlotMachineInfo (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint, uint, uint);
  function getSlotMachineInfos (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint[10], uint[10], uint[10]);*/


}
