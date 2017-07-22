pragma solidity ^0.4.0;

//import "./SlotLib.sol";
import "./SlotMachineStorage.sol";

import "./LibInterface.sol";

contract SlotMachineManager {
    using LibInterface for address;
    address private slotmachineStorage;
    address private admin;
    /*mapping (address => address[]) userdata;*/

    modifier onlyAdmin() {
        if (msg.sender != admin) throw;
        _;
    }

    event slotMachineCreated(address _provider, uint _decider, uint _minBet, uint _maxBet, uint _totalnum, address _slotaddr);
    event slotMachineRemoved(address _provider, address _slotaddr, uint _totalnum);

    function SlotMachineManager (address _storageaddr) {
        slotmachineStorage = _storageaddr;
        admin = msg.sender;
    }

    function setStorage(address _storageaddr) onlyAdmin {
        slotmachineStorage = _storageaddr;
    }

    function getStorageAddr() constant returns (address) {
        return slotmachineStorage;
    }

    function createSlotMachine(uint _decider, uint _minBet, uint _maxBet, uint _maxPrize)
        payable
        returns (address)
    {
        address newslot;
        newslot = slotmachineStorage.createSlotMachine(msg.sender, _decider, _minBet, _maxBet, _maxPrize);
        return newslot;
    }

    function removeSlotMachine(uint _idx) {
        slotmachineStorage.removeSlotMachine(msg.sender, _idx);
    }



}
