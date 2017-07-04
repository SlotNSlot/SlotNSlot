pragma solidity ^0.4.0;
import "./LibInterface.sol";
import "./SlotMachineStorage.sol";

library SlotLib {

    event slotMachineRemoved(address _manageraddr, address _storageaddr, uint _idx);

    //create new slotmachine
    function createSlotMachine (address _slotmachineStorage, address _provider,  uint _decider, uint _minBet, uint _maxBet) {
        SlotMachineStorage(_slotmachineStorage).createSlotMachine(_provider, _decider, _minBet, _maxBet);

    }
    //remove target slotmachine
    function removeSlotMachine (address _slotmachineStorage, uint _idx) {
        uint totalnum = SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine();
        if (_idx >= totalnum)
            throw;
        for (uint i = _idx; i < totalnum-1 ; i++){
            SlotMachineStorage(_slotmachineStorage).setSlotMachine(i, SlotMachineStorage(_slotmachineStorage).getSlotMachine(i + 1));
        }
        SlotMachineStorage(_slotmachineStorage).deleteSlotMachine(totalnum - 1);
        slotMachineRemoved(msg.sender, _slotmachineStorage, _idx);
    }
    //return 5 slotmachines from _idx
    function getSlotMachine (address _slotmachineStorage, uint _idx) returns (address[5]){
        address[5] memory return_slotmachines;
        for (uint i = _idx; i < _idx + 5; i++){
          return_slotmachines[i - _idx] = SlotMachineStorage(_slotmachineStorage).getSlotMachine(i);
        }
    }

    //return number of slotmachines
    function getNumofSlotMachine (address _slotmachineStorage) constant returns (uint) {
        return SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine();
    }

    //return information of slotmachine
    function getSlotMachineDecider (address _slotmachineStorage, uint _idx) constant returns (uint){
        return SlotMachineStorage(_slotmachineStorage).getSlotMachineDecider(_idx);
    }

    function getSlotMachineInfo (address _slotmachineStorage, uint _idx) constant returns (uint, uint, uint){
        return SlotMachineStorage(_slotmachineStorage).getSlotMachineInfo(_idx);
    }

}
