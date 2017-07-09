pragma solidity ^0.4.0;

//import "./SlotMachineStorage.sol";

library LibInterface {

    //create new slotmachine
    function createSlotMachine (address _slotmachineStorage, address _provider,  uint _decider, uint _minBet, uint _maxBet) returns (address);
    //remove target slotmachine
    function removeSlotMachine (address _slotmachineStorage, uint _idx);
    //return 5 slotmachines from _idx
    function getSlotMachine (address _slotmachineStorage, uint _idx) constant returns (address[5]);

    //return number of slotmachines
    function getNumofSlotMachine (address _slotmachineStorage) constant returns (uint);
    //return information of slotmachine (mDecider) => for test
    function getSlotMachineDecider (address _slotmachineStorage, uint _idx) constant returns (uint);
    //return information of slotmachine (mDecider, mMinBet, mMaxBet)
    function getSlotMachineInfo (address _slotmachineStorage, uint _idx) constant returns (uint, uint, uint);


}
