pragma solidity ^0.4.0;

//import "./SlotLib.sol";
import "./SlotMachineStorage.sol";

import "./LibInterface.sol";

contract SlotMachineManager {
    using LibInterface for address;
    address private slotmachineStorage;

    event slotMachineRemoved(address _manageraddr, address _storageaddr, uint _idx);


    function SlotMachineManager () {
        slotmachineStorage = new SlotMachineStorage();
    }

    function getStorageAddr() constant returns (address) {
        return slotmachineStorage;
    }

    function createSlotMachine(address _provider,  uint _decider, uint _minBet, uint _maxBet) {
        slotmachineStorage.createSlotMachine(_provider, _decider, _minBet, _maxBet);
    }

    function removeSlotMachine(uint _idx) {
        slotmachineStorage.removeSlotMachine(_idx);
    }

    function getNumofSlotMachine() constant returns (uint) {
        return slotmachineStorage.getNumofSlotMachine();
    }

    function getSlotMachines(uint _idx) constant returns (address[5]) {
        return slotmachineStorage.getSlotMachine(_idx);
    }

    function getSlotMachineDecider(uint _idx) constant returns (uint) {
        return slotmachineStorage.getSlotMachineDecider(_idx);
    }

    function getSlotMachineInfo(uint _idx) constant returns (uint, uint, uint) {
        return slotmachineStorage.getSlotMachineInfo(_idx);
    }

}
