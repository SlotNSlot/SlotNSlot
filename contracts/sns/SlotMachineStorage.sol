pragma solidity ^0.4.0;


import '../zeppelin/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
    /*address[] private slotMachines;*/
    address[] private useraddress;
    mapping (address => address[]) slotMachines;
    uint private slotMachinesTotalnum;
    //event slotMachineCreated(address provider, uint decider, uint minBet, uint maxBet);

    event userAdded(address _user);

    function SlotMachineStorage (){

    }

    function getOwner() constant returns (address) {
        return owner;
    }

    function addUser(address _user) {
        useraddress.push(_user);
        userAdded(_user);
    }

    function removeUser(uint _idx) {
        uint totalnum = useraddress.length;

    }

    function getNumofUser() returns (uint) {
        return useraddress.length;
    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet)
      onlyOwner
      returns (address) {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet));
        slotMachines[_provider].push(newslot);
        slotMachinesTotalnum++;
        /*slotMachines.push(newslot);*/
        return newslot;
      //  slotMachineCreated(_provider, _decider, _minBet, _maxBet);


    }

    function removeSlotMachine(address _provider, uint _idx)
      onlyOwner
    {
        delete slotMachines[_provider][_idx];
        slotMachines[_provider].length--;
    }
    function setSlotMachine(address _provider, uint _idx, address _newslotMachine) onlyOwner {
        slotMachines[_provider][_idx] = _newslotMachine;
    }

    function getNumofSlotMachine(address _provider)
      onlyOwner
      constant returns (uint)  {
        return slotMachines[_provider].length;
    }

    function getTotalNumofSlotMachine() onlyOwner constant returns (uint) {
        return slotMachinesTotalnum;
    }        /*slotMachines.push(newslot);*/


    function getSlotMachineDecider(address _provider, uint _idx) onlyOwner constant returns (uint){
        return (SlotMachine(slotMachines[_provider][_idx]).mDecider());
    }

    function getSlotMachineInfo(address _provider, uint _idx) onlyOwner constant returns (uint, uint, uint){
      return (SlotMachine(slotMachines[_provider][_idx]).getInfo());
    }

    function getSlotMachine(address _provider, uint _idx) onlyOwner constant returns(address) {
      return slotMachines[_provider][_idx];
    }




}
