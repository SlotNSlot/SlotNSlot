pragma solidity ^0.4.0;
import "./LibInterface.sol";
import "./SlotMachineStorage.sol";

library SlotLib {

    event slotMachineCreated(address _provider, uint _decider, uint _minBet, uint _maxBet, uint _totalnum, address _slotaddr);
    event slotMachineRemoved(address _provider, address _slotaddr, uint _totalnum);


    //create new slotmachine
    function createSlotMachine (address _slotmachineStorage, address _provider,  uint _decider, uint _minBet, uint _maxBet) returns (address) {
        address newslot = address(SlotMachineStorage(_slotmachineStorage).createSlotMachine(_provider, _decider, _minBet, _maxBet));
        slotMachineCreated(_provider, _decider, _minBet, _maxBet, SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine(_provider),newslot);
        /*SlotMachineStorage(_slotmachineStorage).*/
        return newslot;

    }
    function removeSlotMachine (address _slotmachineStorage, address _provider, uint _idx) {
        uint totalnum = SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine(_provider);
        address slottoremove = SlotMachineStorage(_slotmachineStorage).getSlotMachine(_provider, _idx);
        if (_idx >= totalnum)
            throw;
        for (uint i = _idx; i < totalnum-1 ; i++){
            SlotMachineStorage(_slotmachineStorage).setSlotMachine(_provider, i, SlotMachineStorage(_slotmachineStorage).getSlotMachine(_provider, i + 1));
        }
        SlotMachineStorage(_slotmachineStorage).removeSlotMachine(_provider, totalnum - 1);
        slotMachineRemoved(_provider, slottoremove, totalnum-1);
    }

    //return 5 slotmachines of user : _provider
    function getSlotMachines (address _slotmachineStorage, address _provider, uint _idx) returns (address[5]){
        return SlotMachineStorage(_slotmachineStorage).getSlotMachines(_provider, _idx);
    }

    //return number of slotmachines
    function getNumofSlotMachine (address _slotmachineStorage, address _provider) constant returns (uint) {
        uint totalnum = SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine(_provider);
        /*slotMachineRemoved(msg.sender, _slotmachineStorage, totalnum);*/
        /*slotMachineNumber(totalnum);*/
        return totalnum;
    }

    function getTotalNumofSlotMachine(address _slotmachineStorage) constant returns (uint) {
        return SlotMachineStorage(_slotmachineStorage).getTotalNumofSlotMachine();
    }

    //return information of slotmachine
    function getSlotMachineDecider (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint){
        return SlotMachineStorage(_slotmachineStorage).getSlotMachineDecider(_provider, _idx);
    }

    function getSlotMachineInfo (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint, uint, uint){
        return SlotMachineStorage(_slotmachineStorage).getSlotMachineInfo(_provider, _idx);
    }
    function getSlotMachineInfos (address _slotmachineStorage, address _provider, uint _idx) constant returns (uint[10], uint[10], uint[10]){
      return (SlotMachineStorage(_slotmachineStorage).getSlotMachineInfos(_provider, _idx));
    }

}
