pragma solidity ^0.4.0;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
    address[] private slotMachines;

    event SlotMachineCreated(uint _idx);

    function SlotMachineStorage (){

    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet) onlyOwner {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet));
        slotMachines.push(newslot);
        SlotMachineCreated(slotMachines.length-1);
    }

    function getSlotMachine(uint _idx) constant returns (address) {
        if (_idx >= slotMachines.length)
          return 0x0;
        else
          return slotMachines[_idx];
    }

    function addSlotMachine(address _newslotMachine) onlyOwner {
        slotMachines.push(_newslotMachine);
    }

    function setSlotMachine(uint _idx, address _newslotMachine) onlyOwner {
        slotMachines[_idx] = _newslotMachine;
    }

    function getNumofSlotMachine() constant returns (uint) {
        return slotMachines.length;
    }

    function deleteSlotMachine(uint _idx) onlyOwner {
        delete slotMachines[_idx];
        slotMachines.length--;
    }

    function getSlotMachineDecider(uint _idx) constant returns (uint){
        return (SlotMachine(slotMachines[_idx]).mDecider());
    }

    function getSlotMachineInfo(uint _idx) constant returns (uint, uint, uint){
      return (SlotMachine(slotMachines[_idx]).getInfo());
    }

}
