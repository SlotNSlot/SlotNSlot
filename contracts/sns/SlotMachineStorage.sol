pragma solidity ^0.4.0;


import '../zeppelin/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
    address[] private slotMachines;

    event slotMachineCreated(address provider, uint decider, uint minBet, uint maxBet);

    function SlotMachineStorage (){

    }

    function getOwner() constant returns (address) {
      return owner;
    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet) onlyOwner {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet));
        slotMachines.push(newslot);
        slotMachineCreated(_provider, _decider, _minBet, _maxBet);
    }

    function getSlotMachine(uint _idx) onlyOwner constant returns (address) {
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

    function getNumofSlotMachine() onlyOwner constant returns (uint)  {
        return slotMachines.length;
    }

    function deleteSlotMachine(uint _idx) onlyOwner {
        delete slotMachines[_idx];
        slotMachines.length--;
    }

    function getSlotMachineDecider(uint _idx) onlyOwner constant returns (uint){
        return (SlotMachine(slotMachines[_idx]).mDecider());
    }

    function getSlotMachineInfo(uint _idx) onlyOwner constant returns (uint, uint, uint){
      return (SlotMachine(slotMachines[_idx]).getInfo());
    }

}
