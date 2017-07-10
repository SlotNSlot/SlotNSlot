pragma solidity ^0.4.0;

//import "./SlotLib.sol";
import "./SlotMachineStorage.sol";

import "./LibInterface.sol";

contract SlotMachineManager {
    using LibInterface for address;
    address private slotmachineStorage;
    /*mapping (address => address[]) userdata;*/

    event slotMachineCreated(address _provider, uint _decider, uint _minBet, uint _maxBet, uint _totalnum, address _slotaddr);
    event slotMachineRemoved(address _manageraddr, address _storageaddr, uint _idx);

    function SlotMachineManager (address _storageaddr) {
      slotmachineStorage = _storageaddr;
    }

    function setStorage(address _storageaddr) {
      slotmachineStorage = _storageaddr;
    }

    function getStorageAddr() constant returns (address) {
        return slotmachineStorage;
    }

    function createSlotMachine(uint _decider, uint _minBet, uint _maxBet) returns (address) {
        address newslot;
        newslot = slotmachineStorage.createSlotMachine(msg.sender, _decider, _minBet, _maxBet);
        return newslot;
    }

    function removeSlotMachine(uint _idx) {
        slotmachineStorage.removeSlotMachine(msg.sender, _idx);

      }
    function getNumofSlotMachine() constant returns (uint) {
        return slotmachineStorage.getNumofSlotMachine(msg.sender);
    }

    function getSlotMachines(uint _idx) constant returns (address[5]) {
        return slotmachineStorage.getSlotMachines(msg.sender, _idx);
    }

    function getSlotMachineDecider(uint _idx) constant returns (uint) {
        return slotmachineStorage.getSlotMachineDecider(msg.sender, _idx);
    }

    function getSlotMachineInfo(uint _idx) constant returns (uint, uint, uint) {
        return slotmachineStorage.getSlotMachineInfo(msg.sender, _idx);
    }


}
